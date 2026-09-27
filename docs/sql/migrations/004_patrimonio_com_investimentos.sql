-- ============================================================================
-- Evolução do patrimônio passa a contar os investimentos (reservas)
-- ----------------------------------------------------------------------------
-- O que este arquivo faz:
--   Recria SP_EVOLUCAO_PATRIMONIO (criada em 002_painel_financeiro.sql) para
--   também devolver, em cada mês, quanto já foi acumulado em Investimento Fixo
--   e Investimento Variável até o fim daquele mês. Nada mais muda: mesmas
--   colunas de antes continuam lá, só ganham uma companheira nova.
--
-- Por que:
--   SALDO_FINAL vem da tabela SALDOS, que é o caixa "líquido" — todo lançamento
--   Pago, incluindo os de Investimento Fixo/Variável, já é descontado dali (é
--   assim que ATUALIZA_SALDOS sempre funcionou, isso não muda). Então o gráfico
--   de patrimônio, usando só SALDO_FINAL, tratava o dinheiro guardado em
--   investimento como se tivesse desaparecido, quando na verdade virou reserva.
--   Esta correção soma de volta essa reserva acumulada, então "Patrimônio" no
--   painel passa a ser líquido + investido, e não só líquido.
--
-- Como aplicar:
--   Rode este arquivo no seu MariaDB (ex.: HeidiSQL). Aditivo e seguro de rodar
--   mais de uma vez — começa com DROP PROCEDURE IF EXISTS. Não precisa rodar de
--   novo a 002 nem a 003, só esta.
-- ============================================================================

USE `gestaofinanceira`;

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
            -- Última linha de SALDOS dentro do mesmo mês = saldo líquido de fechamento.
            SELECT S2.SALDO
            FROM saldos S2
            WHERE S2.ID_USUARIO = ID_USER
              AND YEAR(S2.DATA_HORA) = YEAR(S.DATA_HORA)
              AND MONTH(S2.DATA_HORA) = MONTH(S.DATA_HORA)
            ORDER BY S2.DATA_HORA DESC, S2.ID_LANC DESC, S2.ID_SALDO DESC
            LIMIT 1
        ) AS SALDO_FINAL,
        (
            -- Tudo que já foi para Investimento Fixo/Variável até o fim deste mês
            -- (mesmo critério de SP_SALDOS_INVESTIMENTOS, só que numa data de corte).
            SELECT COALESCE(SUM(S3.VALORLAN), 0)
            FROM saldos S3
            WHERE S3.ID_USUARIO = ID_USER
              AND S3.CCUSTO IN ('Investimento Fixo', 'Investimento Variável')
              AND S3.DATA_HORA < DATE_ADD(
                    DATE(CONCAT(YEAR(S.DATA_HORA), '-', LPAD(MONTH(S.DATA_HORA), 2, '0'), '-01')),
                    INTERVAL 1 MONTH
                  )
        ) AS INVESTIMENTO_ACUMULADO,
        MAX(S.DATA_HORA) AS DATA_REFERENCIA
    FROM saldos S
    WHERE
        S.ID_USUARIO = ID_USER
        AND S.DATA_HORA >= v_data_corte
    GROUP BY YEAR(S.DATA_HORA), MONTH(S.DATA_HORA)
    ORDER BY ANO, MES_NUM;
END//
DELIMITER ;
