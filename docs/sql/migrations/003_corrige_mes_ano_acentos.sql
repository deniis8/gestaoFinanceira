-- ============================================================================
-- Correção: SP_GASTOS_CENTRO_CUSTO_POR_MES_ANO quebra silenciosamente em "Março"
-- ----------------------------------------------------------------------------
-- O que este arquivo faz:
--   Recria SP_GASTOS_CENTRO_CUSTO_POR_MES_ANO trocando LENGTH() por CHAR_LENGTH()
--   ao separar "Mês" de "- AAAA" no parâmetro MES_ANO. Nada mais muda: mesmas
--   colunas de saída, mesmos filtros, mesma ordem — só a extração do nome do mês.
--
-- Por que:
--   LENGTH() conta bytes, não caracteres. "Março" tem o "ç", que ocupa 2 bytes em
--   utf8/utf8mb4, então "LENGTH('Março - 2026') - 7" dá 6 em vez de 5, e o LEFT()
--   (que já é por caractere) pega "Março " (com o espaço) em vez de "Março". A
--   comparação com 'Março' falha, v_mes fica NULL e a consulta não acha nada —
--   por isso a tela de Gráficos mostrava "nenhum gasto" em março sem motivo real.
--   Os outros 11 meses não têm acento e nunca deram esse problema.
--
-- Como aplicar:
--   Rode este arquivo no seu MariaDB (ex.: HeidiSQL). Aditivo e seguro de rodar
--   mais de uma vez — começa com DROP PROCEDURE IF EXISTS.
-- ============================================================================

USE `gestaofinanceira`;

DROP PROCEDURE IF EXISTS `SP_GASTOS_CENTRO_CUSTO_POR_MES_ANO`;

DELIMITER //
CREATE PROCEDURE `SP_GASTOS_CENTRO_CUSTO_POR_MES_ANO`(
	IN `ID_USER` INT,
	IN `MES_ANO` VARCHAR(20)
)
BEGIN
    DECLARE v_mes INT;
    DECLARE v_ano INT;
    DECLARE v_mes_anterior INT;
    DECLARE v_ano_anterior INT;

    -- Converte o MES_ANO para valores de mês e ano
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

    -- Determina o mês e ano anterior
    IF v_mes = 1 THEN
        SET v_mes_anterior = 12;
        SET v_ano_anterior = v_ano - 1;
    ELSE
        SET v_mes_anterior = v_mes - 1;
        SET v_ano_anterior = v_ano;
    END IF;

    -- Realiza a consulta com base no mês e ano extraídos
    SELECT
        LAN.ID_LANC AS ID_LANC,
        SUM(LAN.VALOR) AS VALOR,
        IFNULL((SELECT
            SUM(LAN_MES_ANTERIOR.VALOR)
            FROM
                lancamentos AS LAN_MES_ANTERIOR
            WHERE
                LAN_MES_ANTERIOR.ID_CCUSTO = LAN.ID_CCUSTO
                AND LAN_MES_ANTERIOR.D_E_L_E_T_ <> '*'
                AND LAN_MES_ANTERIOR.STATUS_LANC = 'Pago'
                AND MONTH(LAN_MES_ANTERIOR.DATA_HORA) = v_mes_anterior
                AND YEAR(LAN_MES_ANTERIOR.DATA_HORA) = v_ano_anterior
                AND LAN_MES_ANTERIOR.ID_USUARIO = ID_USER
        ), 0) AS VALOR_MES_ANTERIOR,
        IFNULL((SELECT
            CONCAT(CASE MONTH(LAN_MES_ANTERIOR.DATA_HORA)
                WHEN 1 THEN 'Janeiro'
                WHEN 2 THEN 'Fevereiro'
                WHEN 3 THEN 'Março'
                WHEN 4 THEN 'Abril'
                WHEN 5 THEN 'Maio'
                WHEN 6 THEN 'Junho'
                WHEN 7 THEN 'Julho'
                WHEN 8 THEN 'Agosto'
                WHEN 9 THEN 'Setembro'
                WHEN 10 THEN 'Outubro'
                WHEN 11 THEN 'Novembro'
                WHEN 12 THEN 'Dezembro'
            END, ' - ', CAST(YEAR(LAN_MES_ANTERIOR.DATA_HORA) AS CHAR))
            FROM
                lancamentos AS LAN_MES_ANTERIOR
            WHERE
                LAN_MES_ANTERIOR.ID_CCUSTO = LAN.ID_CCUSTO
                AND LAN_MES_ANTERIOR.D_E_L_E_T_ <> '*'
                AND LAN_MES_ANTERIOR.STATUS_LANC = 'Pago'
                AND MONTH(LAN_MES_ANTERIOR.DATA_HORA) = v_mes_anterior
                AND YEAR(LAN_MES_ANTERIOR.DATA_HORA) = v_ano_anterior
                AND LAN_MES_ANTERIOR.ID_USUARIO = ID_USER
            LIMIT 1
        ), '') AS MES_ANO_MES_ANTERIOR,
        CC.DESCRI AS DESCRICAO_CENTRO_CUSTO,
        CC.VALOR_LIMITE AS VALOR_LIMITE,
        LAN.DATA_HORA AS DATA_HORA,
        CONCAT(CASE v_mes
            WHEN 1 THEN 'Janeiro'
            WHEN 2 THEN 'Fevereiro'
            WHEN 3 THEN 'Março'
            WHEN 4 THEN 'Abril'
            WHEN 5 THEN 'Maio'
            WHEN 6 THEN 'Junho'
            WHEN 7 THEN 'Julho'
            WHEN 8 THEN 'Agosto'
            WHEN 9 THEN 'Setembro'
            WHEN 10 THEN 'Outubro'
            WHEN 11 THEN 'Novembro'
            WHEN 12 THEN 'Dezembro'
        END, ' - ', v_ano) AS MES_ANO,
        LAN.ID_USUARIO AS ID_USUARIO
    FROM
        lancamentos AS LAN INNER JOIN
        ccusto AS CC ON LAN.ID_CCUSTO = CC.ID_CCUSTO
    WHERE
        LAN.D_E_L_E_T_ <> '*' AND
        CC.D_E_L_E_T_ <> '*' AND
        LAN.STATUS_LANC = 'Pago' AND
        LAN.ID_CCUSTO NOT IN (19, 51) AND
        MONTH(LAN.DATA_HORA) = v_mes AND
        YEAR(LAN.DATA_HORA) = v_ano
        AND LAN.ID_USUARIO = ID_USER
        AND CC.ID_USUARIO = ID_USER
    GROUP BY
        CC.DESCRI, YEAR(LAN.DATA_HORA), MONTH(LAN.DATA_HORA)
    ORDER BY
        VALOR DESC;
END//
DELIMITER ;
