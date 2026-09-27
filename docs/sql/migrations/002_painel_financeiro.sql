-- ============================================================================
-- Painel financeiro (novos indicadores da tela Gráficos) — migração aditiva
-- ----------------------------------------------------------------------------
-- O que este arquivo faz:
--   Cria 4 procedures novas. Nenhuma tabela, view, procedure ou trigger que já
--   existe é alterada, e nenhum dado é apagado ou modificado — só leitura.
--
--   SP_EVOLUCAO_PATRIMONIO      -> saldo de fechamento de cada mês (usa a
--                                  tabela SALDOS que os triggers já mantêm)
--   SP_RESUMO_MES               -> fixo x variável, ticket médio, recebido do
--                                  mês e quantos centros de custo estouraram
--                                  o limite (o maior gasto já sai pronto de
--                                  SP_TOP_GASTOS_MES, não precisa duplicar)
--   SP_TOP_GASTOS_MES           -> os 5 maiores gastos pagos do mês
--   SP_GASTOS_POR_DIA_SEMANA    -> total pago em cada dia da semana do mês
--
-- Como aplicar:
--   Rode o arquivo inteiro no seu MariaDB (ex.: aba de consulta do HeidiSQL,
--   conectado em gestaofinanceira). Pode ser executado mais de uma vez sem
--   problema — cada bloco começa com DROP PROCEDURE IF EXISTS.
--
-- Depois de rodar, publique a nova versão da API (ela já está pronta para
-- chamar essas 4 procedures).
--
-- Nota: para separar "Mês" de "- AAAA" no parâmetro MES_ANO, as procedures
-- abaixo usam CHAR_LENGTH() (conta caracteres), não LENGTH() (conta bytes).
-- Isso evita que "Março" quebre por causa do "ç" ocupar 2 bytes em utf8 —
-- diferença que existe hoje em SP_GASTOS_CENTRO_CUSTO_POR_MES_ANO, mas esse
-- arquivo não mexe nela; veja o resumo desta conversa para mais detalhes.
-- ============================================================================

USE `gestaofinanceira`;

-- ----------------------------------------------------------------------------
-- SP_EVOLUCAO_PATRIMONIO: saldo de fechamento de cada mês, do mais antigo ao
-- mais recente. MESES limita aos últimos N meses; passe NULL para o histórico
-- inteiro. Vira o gráfico de evolução do patrimônio no painel.
-- ----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `SP_EVOLUCAO_PATRIMONIO`;

DELIMITER //
CREATE PROCEDURE `SP_EVOLUCAO_PATRIMONIO`(
    IN `ID_USER` INT,
    IN `MESES` INT
)
BEGIN
    DECLARE v_data_corte DATETIME;

    -- Sem MESES informado, usa uma janela bem larga (equivale a "todo o histórico").
    SET v_data_corte = DATE_SUB(CURDATE(), INTERVAL IFNULL(MESES, 1200) MONTH);

    SELECT
        (YEAR(S.DATA_HORA) * 100 + MONTH(S.DATA_HORA)) AS ID,
        YEAR(S.DATA_HORA) AS ANO,
        MONTH(S.DATA_HORA) AS MES_NUM,
        CASE MONTH(S.DATA_HORA)
            WHEN 1  THEN 'Janeiro'
            WHEN 2  THEN 'Fevereiro'
            WHEN 3  THEN 'Março'
            WHEN 4  THEN 'Abril'
            WHEN 5  THEN 'Maio'
            WHEN 6  THEN 'Junho'
            WHEN 7  THEN 'Julho'
            WHEN 8  THEN 'Agosto'
            WHEN 9  THEN 'Setembro'
            WHEN 10 THEN 'Outubro'
            WHEN 11 THEN 'Novembro'
            WHEN 12 THEN 'Dezembro'
        END AS MES,
        (
            -- Última linha de SALDOS dentro do mesmo mês = saldo de fechamento.
            SELECT S2.SALDO
            FROM saldos S2
            WHERE S2.ID_USUARIO = ID_USER
              AND YEAR(S2.DATA_HORA) = YEAR(S.DATA_HORA)
              AND MONTH(S2.DATA_HORA) = MONTH(S.DATA_HORA)
            ORDER BY S2.DATA_HORA DESC, S2.ID_LANC DESC, S2.ID_SALDO DESC
            LIMIT 1
        ) AS SALDO_FINAL,
        MAX(S.DATA_HORA) AS DATA_REFERENCIA
    FROM saldos S
    WHERE
        S.ID_USUARIO = ID_USER
        AND S.DATA_HORA >= v_data_corte
    GROUP BY YEAR(S.DATA_HORA), MONTH(S.DATA_HORA)
    ORDER BY ANO, MES_NUM;
END//
DELIMITER ;

-- ----------------------------------------------------------------------------
-- SP_RESUMO_MES: um resumo por mês (sempre uma única linha, mesmo em mês sem
-- lançamento nenhum). MES_ANO no mesmo formato já usado em SP_GASTOS_CENTRO_
-- CUSTO_POR_MES_ANO, ex.: 'Setembro - 2026'.
-- ----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `SP_RESUMO_MES`;

DELIMITER //
CREATE PROCEDURE `SP_RESUMO_MES`(
    IN `ID_USER` INT,
    IN `MES_ANO` VARCHAR(20)
)
BEGIN
    DECLARE v_mes INT;
    DECLARE v_ano INT;

    SET v_mes = CASE
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Janeiro' THEN 1
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Fevereiro' THEN 2
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Março' THEN 3
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Abril' THEN 4
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Maio' THEN 5
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Junho' THEN 6
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Julho' THEN 7
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Agosto' THEN 8
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Setembro' THEN 9
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Outubro' THEN 10
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Novembro' THEN 11
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Dezembro' THEN 12
    END;
    SET v_ano = CAST(RIGHT(MES_ANO, 4) AS UNSIGNED);

    SELECT
        1 AS ID,
        IFNULL(SUM(CASE WHEN LAN.ID_LANC_FIXO IS NOT NULL THEN LAN.VALOR ELSE 0 END), 0) AS VALOR_FIXO,
        IFNULL(SUM(CASE WHEN LAN.ID_LANC_FIXO IS NULL THEN LAN.VALOR ELSE 0 END), 0) AS VALOR_VARIAVEL,
        SUM(CASE WHEN LAN.ID_LANC_FIXO IS NOT NULL THEN 1 ELSE 0 END) AS QUANTIDADE_FIXA,
        SUM(CASE WHEN LAN.ID_LANC_FIXO IS NULL THEN 1 ELSE 0 END) AS QUANTIDADE_VARIAVEL,
        IFNULL(SUM(LAN.VALOR) / NULLIF(COUNT(*), 0), 0) AS TICKET_MEDIO,
        (
            SELECT COALESCE(SUM(r.VALOR), 0)
            FROM lancamentos r
            WHERE r.STATUS_LANC = 'Recebido'
              AND r.ID_CCUSTO NOT IN (19,51)
              AND r.D_E_L_E_T_ <> '*'
              AND MONTH(r.DATA_HORA) = v_mes
              AND YEAR(r.DATA_HORA) = v_ano
              AND r.ID_USUARIO = ID_USER
        ) AS VALOR_RECEBIDO_MES,
        (
            SELECT COUNT(*)
            FROM ccusto CC3
            WHERE CC3.ID_USUARIO = ID_USER AND CC3.D_E_L_E_T_ <> '*' AND CC3.VALOR_LIMITE > 0
        ) AS TOTAL_CATEGORIAS_COM_LIMITE,
        (
            SELECT COUNT(*)
            FROM (
                SELECT CC4.ID_CCUSTO
                FROM ccusto CC4
                INNER JOIN lancamentos LAN4 ON LAN4.ID_CCUSTO = CC4.ID_CCUSTO
                WHERE CC4.ID_USUARIO = ID_USER AND CC4.D_E_L_E_T_ <> '*' AND CC4.VALOR_LIMITE > 0
                  AND LAN4.STATUS_LANC = 'Pago' AND LAN4.D_E_L_E_T_ <> '*'
                  AND MONTH(LAN4.DATA_HORA) = v_mes AND YEAR(LAN4.DATA_HORA) = v_ano
                GROUP BY CC4.ID_CCUSTO, CC4.VALOR_LIMITE
                HAVING SUM(LAN4.VALOR) > CC4.VALOR_LIMITE
            ) ESTOURADAS
        ) AS CATEGORIAS_ESTOURADAS
    FROM lancamentos LAN
    WHERE
        LAN.STATUS_LANC = 'Pago'
        AND LAN.ID_CCUSTO NOT IN (19,51)
        AND LAN.D_E_L_E_T_ <> '*'
        AND LAN.ID_USUARIO = ID_USER
        AND MONTH(LAN.DATA_HORA) = v_mes
        AND YEAR(LAN.DATA_HORA) = v_ano;
END//
DELIMITER ;

-- ----------------------------------------------------------------------------
-- SP_TOP_GASTOS_MES: os 5 maiores gastos pagos do mês (mesmo MES_ANO acima).
-- ----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `SP_TOP_GASTOS_MES`;

DELIMITER //
CREATE PROCEDURE `SP_TOP_GASTOS_MES`(
    IN `ID_USER` INT,
    IN `MES_ANO` VARCHAR(20)
)
BEGIN
    DECLARE v_mes INT;
    DECLARE v_ano INT;

    SET v_mes = CASE
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Janeiro' THEN 1
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Fevereiro' THEN 2
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Março' THEN 3
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Abril' THEN 4
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Maio' THEN 5
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Junho' THEN 6
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Julho' THEN 7
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Agosto' THEN 8
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Setembro' THEN 9
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Outubro' THEN 10
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Novembro' THEN 11
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Dezembro' THEN 12
    END;
    SET v_ano = CAST(RIGHT(MES_ANO, 4) AS UNSIGNED);

    SELECT
        LAN.ID_LANC AS ID,
        LAN.DATA_HORA,
        LAN.VALOR,
        LAN.DESCRICAO,
        CC.DESCRI AS DESCRICAO_CENTRO_CUSTO
    FROM lancamentos LAN
    INNER JOIN ccusto CC ON CC.ID_CCUSTO = LAN.ID_CCUSTO
    WHERE
        LAN.STATUS_LANC = 'Pago'
        AND LAN.ID_CCUSTO NOT IN (19,51)
        AND LAN.D_E_L_E_T_ <> '*'
        AND CC.D_E_L_E_T_ <> '*'
        AND LAN.ID_USUARIO = ID_USER
        AND CC.ID_USUARIO = ID_USER
        AND MONTH(LAN.DATA_HORA) = v_mes
        AND YEAR(LAN.DATA_HORA) = v_ano
    ORDER BY LAN.VALOR DESC, LAN.DATA_HORA DESC
    LIMIT 5;
END//
DELIMITER ;

-- ----------------------------------------------------------------------------
-- SP_GASTOS_POR_DIA_SEMANA: total pago em cada dia da semana do mês (mesmo
-- MES_ANO acima). Sempre 7 linhas, de Domingo a Sábado, mesmo em dias sem
-- nenhum gasto — os números seguem o mesmo DAYOFWEEK (1=Domingo) já usado
-- em vw_lancamentos.
-- ----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `SP_GASTOS_POR_DIA_SEMANA`;

DELIMITER //
CREATE PROCEDURE `SP_GASTOS_POR_DIA_SEMANA`(
    IN `ID_USER` INT,
    IN `MES_ANO` VARCHAR(20)
)
BEGIN
    DECLARE v_mes INT;
    DECLARE v_ano INT;

    SET v_mes = CASE
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Janeiro' THEN 1
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Fevereiro' THEN 2
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Março' THEN 3
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Abril' THEN 4
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Maio' THEN 5
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Junho' THEN 6
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Julho' THEN 7
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Agosto' THEN 8
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Setembro' THEN 9
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Outubro' THEN 10
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Novembro' THEN 11
        WHEN LEFT(MES_ANO, CHAR_LENGTH(MES_ANO) - 7) = 'Dezembro' THEN 12
    END;
    SET v_ano = CAST(RIGHT(MES_ANO, 4) AS UNSIGNED);

    SELECT
        DIAS.NUMERO AS ID,
        DIAS.NUMERO AS DIA_SEMANA_NUM,
        CASE DIAS.NUMERO
            WHEN 1 THEN 'Domingo'
            WHEN 2 THEN 'Segunda'
            WHEN 3 THEN 'Terça'
            WHEN 4 THEN 'Quarta'
            WHEN 5 THEN 'Quinta'
            WHEN 6 THEN 'Sexta'
            WHEN 7 THEN 'Sábado'
        END AS DIA_SEMANA,
        IFNULL(RESUMO.VALOR_TOTAL, 0) AS VALOR_TOTAL,
        IFNULL(RESUMO.QUANTIDADE, 0) AS QUANTIDADE
    FROM (
        SELECT 1 AS NUMERO UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
        SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
    ) DIAS
    LEFT JOIN (
        SELECT
            DAYOFWEEK(LAN.DATA_HORA) AS NUMERO,
            SUM(LAN.VALOR) AS VALOR_TOTAL,
            COUNT(*) AS QUANTIDADE
        FROM lancamentos LAN
        WHERE
            LAN.STATUS_LANC = 'Pago'
            AND LAN.ID_CCUSTO NOT IN (19,51)
            AND LAN.D_E_L_E_T_ <> '*'
            AND LAN.ID_USUARIO = ID_USER
            AND MONTH(LAN.DATA_HORA) = v_mes
            AND YEAR(LAN.DATA_HORA) = v_ano
        GROUP BY DAYOFWEEK(LAN.DATA_HORA)
    ) RESUMO ON RESUMO.NUMERO = DIAS.NUMERO
    ORDER BY DIAS.NUMERO;
END//
DELIMITER ;
