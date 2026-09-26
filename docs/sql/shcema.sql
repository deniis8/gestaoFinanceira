-- --------------------------------------------------------
-- Servidor:                     192.168.1.110
-- Versão do servidor:           10.3.39-MariaDB-0ubuntu0.20.04.2 - Ubuntu 20.04
-- OS do Servidor:               debian-linux-gnu
-- HeidiSQL Versão:              12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para gestaofinanceira
CREATE DATABASE IF NOT EXISTS `gestaofinanceira` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci */;
USE `gestaofinanceira`;

-- Copiando estrutura para procedure gestaofinanceira.ATUALIZA_SALDOS
DELIMITER //
CREATE PROCEDURE `ATUALIZA_SALDOS`(
	IN `DATA_REGISTRO` DATETIME,
	IN `ID_USER` INT
)
BEGIN
	DECLARE done INT DEFAULT FALSE;
	
	DECLARE INSERT_ID_LANC 			INT; 
	DECLARE INSERT_DATA_HORA 		DATETIME; 
	DECLARE INSERT_VALOR 			NUMERIC(10,2); 
	DECLARE INSERT_DESCRICAO 		VARCHAR(2000); 
	DECLARE INSERT_CCUSTO	 		VARCHAR (30); 
	DECLARE INSERT_STATUS_LANC 	VARCHAR(20); 
	DECLARE INSERT_DATA_CRIACAO 	DATETIME;
	DECLARE INSERT_ID_USUARIO 		INT;	
	DECLARE _SALDO 					NUMERIC(10, 2);
	DECLARE QUANTIDADE				INT;
	
	DECLARE FORLANCAMENTOS CURSOR FOR SELECT 
			  LANC.ID_LANC,
			  LANC.DATA_HORA, 
			  LANC.VALOR, 
			  LANC.DESCRICAO,
			  (SELECT DESCRI FROM ccusto AS CC WHERE CC.ID_USUARIO=ID_USER AND CC.ID_CCUSTO = LANC.ID_CCUSTO AND CC.D_E_L_E_T_ <> '*') AS CCENTRO, 
			  LANC.STATUS_LANC, 
			  LANC.DATA_CRIACAO, 
			  LANC.ID_USUARIO 
        FROM 
		  		lancamentos AS LANC
		  	WHERE 
		  		LANC.DATA_HORA>=DATE(DATA_REGISTRO) AND LANC.STATUS_LANC IN('Pago','Recebido') AND 
				LANC.ID_USUARIO=ID_USER AND LANC.D_E_L_E_T_<>'*'
        ORDER BY 
		  		DATA_HORA, DATA_CRIACAO;		  		
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
	
	DELETE FROM saldos WHERE DATA_HORA >= DATE(DATA_REGISTRO) AND ID_USUARIO=ID_USER;
	SELECT COUNT(*) INTO QUANTIDADE FROM saldos WHERE ID_USUARIO=ID_USER;	
	
	IF QUANTIDADE>0 THEN	
		SELECT SALDO INTO _SALDO FROM saldos WHERE ID_USUARIO=ID_USER ORDER BY DATA_HORA DESC LIMIT 1;
	ELSE
		SET _SALDO := 0;
   END IF;
		  		
  	OPEN FORLANCAMENTOS;
  	
  	-- Percorrer Lançamentos e fazer insert na tabela saldos
	read_loop: loop	
		FETCH FORLANCAMENTOS INTO INSERT_ID_LANC, INSERT_DATA_HORA, INSERT_VALOR, INSERT_DESCRICAO, INSERT_CCUSTO, 
			  INSERT_STATUS_LANC, INSERT_DATA_CRIACAO, INSERT_ID_USUARIO;
			  
		IF done THEN
			LEAVE read_loop;
    	END IF;
   
	   IF INSERT_STATUS_LANC='Pago' THEN
	   	SET _SALDO := _SALDO-INSERT_VALOR;
	   ELSEIF INSERT_STATUS_LANC='Recebido' THEN
	   	SET _SALDO := _SALDO+INSERT_VALOR;
	   END IF;
   
   
	INSERT INTO SALDOS(DATA_HORA, VALORLAN, DESCRILAN, SALDO, CCUSTO, STATUS_LANC, ID_LANC, ID_USUARIO) 
		VALUES(INSERT_DATA_HORA, 
				  INSERT_VALOR, 
				  INSERT_DESCRICAO, 
				  _SALDO, 
				  INSERT_CCUSTO,				  
				  INSERT_STATUS_LANC, 
				  INSERT_ID_LANC, 
				  INSERT_ID_USUARIO);
				  
	end loop read_loop;
	
	CLOSE FORLANCAMENTOS;

END//
DELIMITER ;

-- Copiando estrutura para tabela gestaofinanceira.ccusto
CREATE TABLE IF NOT EXISTS `ccusto` (
  `ID_CCUSTO` int(11) NOT NULL AUTO_INCREMENT,
  `DESCRI` varchar(50) NOT NULL,
  `DATA_CRIACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `ID_USUARIO` int(11) NOT NULL,
  `VALOR_LIMITE` decimal(10,2) DEFAULT NULL,
  `D_E_L_E_T_` char(1) NOT NULL,
  PRIMARY KEY (`ID_CCUSTO`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela gestaofinanceira.configuracoesia
CREATE TABLE IF NOT EXISTS `configuracoesia` (
  `ID_CONFIGURACAO` int(11) NOT NULL AUTO_INCREMENT,
  `FILTRO_DATA_DE` datetime NOT NULL,
  `FILTRO_DATA_ATE` datetime NOT NULL,
  `PROMPT` varchar(20000) NOT NULL,
  `DATA_CRIACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `ID_USUARIO` int(11) NOT NULL,
  `D_E_L_E_T_` varchar(1) NOT NULL,
  PRIMARY KEY (`ID_CONFIGURACAO`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para evento gestaofinanceira.inserir_lancamentos_diario
DELIMITER //
CREATE EVENT `inserir_lancamentos_diario` ON SCHEDULE EVERY 1 DAY STARTS '2025-04-11 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    INSERT INTO LANCAMENTOS (DATA_HORA, VALOR, DESCRICAO, ID_CCUSTO, STATUS_LANC, DATA_CRIACAO, ID_USUARIO, ID_LANC_FIXO, D_E_L_E_T_)
    SELECT 
        NOW(), 
        VALOR, 
        DESCRICAO, 
        ID_CCUSTO, 
        STATUS_LANC, 
        NOW(), 
        ID_USUARIO,
        ID_LANC_FIXO,
        D_E_L_E_T_
    FROM lancamentosfixos AS LF
    WHERE DIA_MES = DAY(CURDATE())
    AND NOT EXISTS (
    SELECT 1 FROM LANCAMENTOS L WHERE L.ID_LANC_FIXO = LF.ID_LANC_FIXO AND L.STATUS_LANC IN('A Pagar', 'A Receber') AND D_E_L_E_T_<>'*'
		)
	 AND D_E_L_E_T_<>'*';

END//
DELIMITER ;

-- Copiando estrutura para tabela gestaofinanceira.lancamentos
CREATE TABLE IF NOT EXISTS `lancamentos` (
  `ID_LANC` int(11) NOT NULL AUTO_INCREMENT,
  `DATA_HORA` datetime NOT NULL,
  `VALOR` decimal(10,2) NOT NULL,
  `DESCRICAO` varchar(2000) NOT NULL,
  `ID_CCUSTO` int(11) NOT NULL,
  `STATUS_LANC` varchar(20) NOT NULL,
  `DATA_CRIACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `ID_USUARIO` int(11) NOT NULL,
  `ID_LANC_FIXO` int(11) DEFAULT NULL,
  `D_E_L_E_T_` varchar(1) NOT NULL,
  PRIMARY KEY (`ID_LANC`)
) ENGINE=InnoDB AUTO_INCREMENT=6634 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela gestaofinanceira.lancamentosfixos
CREATE TABLE IF NOT EXISTS `lancamentosfixos` (
  `ID_LANC_FIXO` int(11) NOT NULL AUTO_INCREMENT,
  `DIA_MES` int(11) NOT NULL,
  `VALOR` decimal(10,2) NOT NULL,
  `DESCRICAO` varchar(100) NOT NULL,
  `ID_CCUSTO` int(11) NOT NULL,
  `STATUS_LANC` varchar(20) NOT NULL,
  `DATA_CRIACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `ID_USUARIO` int(11) NOT NULL,
  `D_E_L_E_T_` varchar(1) NOT NULL,
  PRIMARY KEY (`ID_LANC_FIXO`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela gestaofinanceira.saldos
CREATE TABLE IF NOT EXISTS `saldos` (
  `ID_SALDO` int(11) NOT NULL AUTO_INCREMENT,
  `DATA_HORA` datetime NOT NULL,
  `VALORLAN` decimal(10,2) DEFAULT NULL,
  `DESCRILAN` varchar(2000) DEFAULT NULL,
  `SALDO` decimal(10,2) NOT NULL,
  `CCUSTO` varchar(30) DEFAULT NULL,
  `STATUS_LANC` varchar(20) DEFAULT NULL,
  `ID_LANC` int(11) DEFAULT NULL,
  `ID_USUARIO` int(11) NOT NULL,
  `DATA_CRIACAO` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ID_SALDO`),
  KEY `FK_LANCAMENTO_SALDO` (`ID_LANC`),
  CONSTRAINT `FK_LANCAMENTO_SALDO` FOREIGN KEY (`ID_LANC`) REFERENCES `lancamentos` (`ID_LANC`)
) ENGINE=InnoDB AUTO_INCREMENT=70973 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para procedure gestaofinanceira.SP_GASTOS_CENTRO_CUSTO_POR_MES_ANO
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
        WHEN LEFT(MES_ANO, LENGTH(MES_ANO) - 7) = 'Janeiro' THEN 1
        WHEN LEFT(MES_ANO, LENGTH(MES_ANO) - 7) = 'Fevereiro' THEN 2
        WHEN LEFT(MES_ANO, LENGTH(MES_ANO) - 7) = 'Março' THEN 3
        WHEN LEFT(MES_ANO, LENGTH(MES_ANO) - 7) = 'Abril' THEN 4
        WHEN LEFT(MES_ANO, LENGTH(MES_ANO) - 7) = 'Maio' THEN 5
        WHEN LEFT(MES_ANO, LENGTH(MES_ANO) - 7) = 'Junho' THEN 6
        WHEN LEFT(MES_ANO, LENGTH(MES_ANO) - 7) = 'Julho' THEN 7
        WHEN LEFT(MES_ANO, LENGTH(MES_ANO) - 7) = 'Agosto' THEN 8
        WHEN LEFT(MES_ANO, LENGTH(MES_ANO) - 7) = 'Setembro' THEN 9
        WHEN LEFT(MES_ANO, LENGTH(MES_ANO) - 7) = 'Outubro' THEN 10
        WHEN LEFT(MES_ANO, LENGTH(MES_ANO) - 7) = 'Novembro' THEN 11
        WHEN LEFT(MES_ANO, LENGTH(MES_ANO) - 7) = 'Dezembro' THEN 12
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

-- Copiando estrutura para procedure gestaofinanceira.SP_GASTOS_CENTRO_CUSTO_POR_MES_IA
DELIMITER //
CREATE PROCEDURE `SP_GASTOS_CENTRO_CUSTO_POR_MES_IA`(
    IN p_id_usuario INT,
    IN p_data_de DATETIME,
    IN p_data_ate DATETIME
)
BEGIN
    SELECT
        DATE_FORMAT(LAN.DATA_HORA, '%Y-%m') AS ANO_MES,
        CC.DESCRI AS DESCRICAO_CC,
        SUM(LAN.VALOR) AS VALOR
    FROM lancamentos LAN
    JOIN ccusto CC
        ON CC.ID_CCUSTO = LAN.ID_CCUSTO
       AND CC.D_E_L_E_T_ <> '*'
    WHERE
        LAN.ID_USUARIO = p_id_usuario
        AND LAN.D_E_L_E_T_ <> '*'
        AND LAN.ID_CCUSTO NOT IN (19,51)
        AND LAN.STATUS_LANC = 'Pago'
        AND LAN.DATA_HORA BETWEEN p_data_de AND p_data_ate
    GROUP BY
        DATE_FORMAT(LAN.DATA_HORA, '%Y-%m'),
        LAN.ID_CCUSTO,
        CC.DESCRI
    ORDER BY
        ANO_MES,
        CC.DESCRI;
END//
DELIMITER ;

-- Copiando estrutura para procedure gestaofinanceira.SP_GASTOS_MENSAIS
DELIMITER //
CREATE PROCEDURE `SP_GASTOS_MENSAIS`(
    IN ID_USER INT,
    IN APARTIR_DE DATETIME,
    IN ATE DATETIME
)
BEGIN

    SELECT 
        MIN(l.ID_LANC) AS ID_GASTO_MENSAL,
        SUM(l.VALOR) AS VALOR,
        YEAR(l.DATA_HORA) AS ANO,

        CASE MONTH(l.DATA_HORA) 
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

        MIN(l.DATA_HORA) AS DATA_HORA,

        (
            SELECT COALESCE(SUM(r.VALOR), 0) 
            FROM lancamentos r 
            WHERE 
                r.STATUS_LANC = 'Recebido'
                AND r.ID_CCUSTO NOT IN (19,51)
                AND r.D_E_L_E_T_ <> '*'
                AND YEAR(r.DATA_HORA) = YEAR(l.DATA_HORA)
                AND MONTH(r.DATA_HORA) = MONTH(l.DATA_HORA)
                AND r.ID_USUARIO = ID_USER
                AND (APARTIR_DE IS NULL OR r.DATA_HORA >= APARTIR_DE)
                AND (
                    ATE IS NULL 
                    OR r.DATA_HORA < DATE_ADD(ATE, INTERVAL 1 DAY)
                )
        ) AS VALOR_RECEBIDO_MES,

        (
            (
                SELECT COALESCE(SUM(r.VALOR), 0) 
                FROM lancamentos r 
                WHERE 
                    r.STATUS_LANC = 'Recebido'
                    AND r.ID_CCUSTO NOT IN (19,51)
                    AND r.D_E_L_E_T_ <> '*'
                    AND YEAR(r.DATA_HORA) = YEAR(l.DATA_HORA)
                    AND MONTH(r.DATA_HORA) = MONTH(l.DATA_HORA)
                    AND r.ID_USUARIO = ID_USER
                    AND (APARTIR_DE IS NULL OR r.DATA_HORA >= APARTIR_DE)
                    AND (
                        ATE IS NULL 
                        OR r.DATA_HORA < DATE_ADD(ATE, INTERVAL 1 DAY)
                    )
            ) - SUM(l.VALOR)
        ) AS SOBRA_MES,

        l.ID_USUARIO

    FROM lancamentos l
    WHERE 
        l.STATUS_LANC = 'Pago'
        AND l.ID_CCUSTO NOT IN (19,51)
        AND l.D_E_L_E_T_ <> '*'
        AND l.ID_USUARIO = ID_USER
        AND (APARTIR_DE IS NULL OR l.DATA_HORA >= APARTIR_DE)
        AND (
            ATE IS NULL 
            OR l.DATA_HORA < DATE_ADD(ATE, INTERVAL 1 DAY)
        )

    GROUP BY 
        YEAR(l.DATA_HORA),
        MONTH(l.DATA_HORA),
        l.ID_USUARIO

    ORDER BY 
        YEAR(l.DATA_HORA),
        MONTH(l.DATA_HORA);

END//
DELIMITER ;

-- Copiando estrutura para procedure gestaofinanceira.SP_INVESTIMENTOS_POR_PERIODO_IA
DELIMITER //
CREATE PROCEDURE `SP_INVESTIMENTOS_POR_PERIODO_IA`(
    IN p_id_usuario INT,
    IN p_data_de DATETIME,
    IN p_data_ate DATETIME
)
BEGIN
    SELECT
        LAN.DATA_HORA,
        CC.DESCRI AS DESCRICAO_CC,
        LAN.DESCRICAO AS DESCRICAO_LAN,
        LAN.VALOR
    FROM lancamentos LAN
    JOIN ccusto CC
        ON CC.ID_CCUSTO = LAN.ID_CCUSTO
       AND CC.D_E_L_E_T_ <> '*'
    WHERE
        LAN.ID_USUARIO = p_id_usuario
        AND LAN.D_E_L_E_T_ <> '*'
        AND LAN.STATUS_LANC = 'Pago'
        AND LAN.ID_CCUSTO IN (19, 51)
        AND LAN.DATA_HORA BETWEEN p_data_de AND p_data_ate
    ORDER BY
        LAN.DATA_HORA;
END//
DELIMITER ;

-- Copiando estrutura para procedure gestaofinanceira.SP_LANCAMENTOS_RECEBIDOS_IA
DELIMITER //
CREATE PROCEDURE `SP_LANCAMENTOS_RECEBIDOS_IA`(
    IN ID_USER INT,
    IN DATA_DE DATE,
    IN DATA_ATE DATE
)
BEGIN
    SELECT 
        DATA_HORA,
        VALOR,
        DESCRICAO,
        STATUS_LANC
    FROM
        LANCAMENTOS
    WHERE
        ID_USUARIO = ID_USER
        AND D_E_L_E_T_ <> '*'
        AND STATUS_LANC = 'Recebido'
        AND DATA_HORA BETWEEN DATA_DE AND DATA_ATE
    ORDER BY
        DATA_HORA;
END//
DELIMITER ;

-- Copiando estrutura para procedure gestaofinanceira.SP_SALDOS_INVESTIMENTOS
DELIMITER //
CREATE PROCEDURE `SP_SALDOS_INVESTIMENTOS`(
	IN `ID_USER` INT
)
SELECT 
	SAL.ID_SALDO,
    IFNULL(
        (SELECT SAL.SALDO
         FROM saldos SAL
         WHERE SAL.ID_USUARIO = ID_USER 
         ORDER BY SAL.DATA_HORA DESC, SAL.ID_LANC DESC 
         LIMIT 1), 
        0
    ) AS SALDO,

    IFNULL(
        (SELECT SUM(SAL.VALORLAN) 
         FROM saldos SAL 
         WHERE SAL.CCUSTO = 'Investimento Fixo' 
         AND SAL.ID_USUARIO = ID_USER), 
        0
    ) AS INVESTIMENTO_FIXO,

    IFNULL(
        (SELECT SUM(SAL.VALORLAN) 
         FROM saldos SAL 
         WHERE SAL.CCUSTO = 'Investimento Variável' 
         AND SAL.ID_USUARIO = ID_USER), 
        0
    ) AS INVESTIMENTO_VARIAVEL,
    SAL.ID_USUARIO
FROM saldos SAL
WHERE SAL.ID_USUARIO = ID_USER
LIMIT 1//
DELIMITER ;

-- Copiando estrutura para tabela gestaofinanceira.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT,
  `NOME_COMPLETO` varchar(100) NOT NULL,
  `EMAIL` varchar(100) NOT NULL,
  `SENHA` varchar(20) NOT NULL,
  `DATA_CRIACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `REFRESH_TOKEN` varchar(2000) DEFAULT NULL,
  `REFRESH_TOKEN_DATA_EXPIRACAO` datetime DEFAULT NULL,
  `D_E_L_E_T_` char(1) NOT NULL,
  PRIMARY KEY (`ID_USUARIO`),
  UNIQUE KEY `EMAIL` (`EMAIL`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para view gestaofinanceira.vw_detalhamento_gastos_centro_custo
-- Criando tabela temporária para evitar erros de dependência de VIEW
CREATE TABLE `vw_detalhamento_gastos_centro_custo` (
	`ID_LANC` INT(11) NOT NULL,
	`VALOR` DECIMAL(10,2) NOT NULL,
	`DESCRICAO_LANCAMENTO` VARCHAR(2000) NOT NULL COLLATE 'utf8_general_ci',
	`DESCRICAO_CENTRO_CUSTO` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`DATA_HORA` DATETIME NOT NULL,
	`MES_ANO` VARCHAR(16) NULL COLLATE 'utf8mb4_general_ci',
	`ID_USUARIO` INT(11) NOT NULL
) ENGINE=MyISAM;

-- Copiando estrutura para view gestaofinanceira.vw_gastos_mensais
-- Criando tabela temporária para evitar erros de dependência de VIEW
CREATE TABLE `vw_gastos_mensais` (
	`ID_GASTO_MENSAL` INT(11) NOT NULL,
	`VALOR` DECIMAL(32,2) NULL,
	`ANO` INT(4) NULL,
	`MES` VARCHAR(9) NULL COLLATE 'utf8mb4_general_ci',
	`DATA_HORA` DATETIME NOT NULL,
	`VALOR_RECEBIDO_MES` DECIMAL(32,2) NULL,
	`SOBRA_MES` DECIMAL(33,2) NULL,
	`ID_USUARIO` INT(11) NOT NULL
) ENGINE=MyISAM;

-- Copiando estrutura para view gestaofinanceira.vw_lancamentos
-- Criando tabela temporária para evitar erros de dependência de VIEW
CREATE TABLE `vw_lancamentos` (
	`ID_LANC` INT(11) NOT NULL,
	`DATA_HORA` DATETIME NOT NULL,
	`DIAS_SEMANA` VARCHAR(13) NULL COLLATE 'utf8mb4_general_ci',
	`VALOR` DECIMAL(10,2) NOT NULL,
	`DESCRICAO` VARCHAR(2000) NOT NULL COLLATE 'utf8_general_ci',
	`ID_CCUSTO` INT(11) NOT NULL,
	`DESCRI_CC` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`STATUS_LANC` VARCHAR(20) NOT NULL COLLATE 'utf8_general_ci',
	`ID_USUARIO` INT(11) NOT NULL
) ENGINE=MyISAM;

-- Copiando estrutura para view gestaofinanceira.vw_saldos_investimentos
-- Criando tabela temporária para evitar erros de dependência de VIEW
CREATE TABLE `vw_saldos_investimentos` (
	`ID_SALDO` INT(11) NOT NULL,
	`SALDO` DECIMAL(10,2) NULL,
	`INVESTIMENTO_FIXO` DECIMAL(32,2) NULL,
	`INVESTIMENTO_VARIAVEL` DECIMAL(32,2) NULL,
	`ID_USUARIO` INT(11) NOT NULL
) ENGINE=MyISAM;

-- Copiando estrutura para trigger gestaofinanceira.ALT_ATUALIZA_SALDOS
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `ALT_ATUALIZA_SALDOS` AFTER UPDATE ON `lancamentos` FOR EACH ROW BEGIN

CALL ATUALIZA_SALDOS(NEW.DATA_HORA, NEW.ID_USUARIO);

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Copiando estrutura para trigger gestaofinanceira.DEL_ATUALIZA_SALDOS
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `DEL_ATUALIZA_SALDOS` AFTER DELETE ON `lancamentos` FOR EACH ROW BEGIN

CALL ATUALIZA_SALDOS(OLD.DATA_HORA, OLD.ID_USUARIO);

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Copiando estrutura para trigger gestaofinanceira.INSERT_ATUALIZA_SALDOS
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `INSERT_ATUALIZA_SALDOS` AFTER INSERT ON `lancamentos` FOR EACH ROW BEGIN

CALL ATUALIZA_SALDOS(NEW.DATA_HORA, NEW.ID_USUARIO);

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Copiando estrutura para view gestaofinanceira.vw_detalhamento_gastos_centro_custo
-- Removendo tabela temporária e criando a estrutura VIEW final
DROP TABLE IF EXISTS `vw_detalhamento_gastos_centro_custo`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_detalhamento_gastos_centro_custo` AS select `lan`.`ID_LANC` AS `ID_LANC`,`lan`.`VALOR` AS `VALOR`,`lan`.`DESCRICAO` AS `DESCRICAO_LANCAMENTO`,`cc`.`DESCRI` AS `DESCRICAO_CENTRO_CUSTO`,`lan`.`DATA_HORA` AS `DATA_HORA`,concat(case month(`lan`.`DATA_HORA`) when 1 then 'Janeiro' when 2 then 'Fevereiro' when 3 then 'Março' when 4 then 'Abril' when 5 then 'Maio' when 6 then 'Junho' when 7 then 'Julho' when 8 then 'Agosto' when 9 then 'Setembro' when 10 then 'Outubro' when 11 then 'Novembro' when 12 then 'Dezembro' end,' - ',cast(year(`lan`.`DATA_HORA`) as char charset utf8mb4)) AS `MES_ANO`,`lan`.`ID_USUARIO` AS `ID_USUARIO` from (`lancamentos` `lan` join `ccusto` `cc` on(`lan`.`ID_CCUSTO` = `cc`.`ID_CCUSTO`)) where `lan`.`D_E_L_E_T_` <> '*' and `cc`.`D_E_L_E_T_` <> '*' and `lan`.`STATUS_LANC` = 'Pago' and `lan`.`ID_CCUSTO` not in (19,51);

-- Copiando estrutura para view gestaofinanceira.vw_gastos_mensais
-- Removendo tabela temporária e criando a estrutura VIEW final
DROP TABLE IF EXISTS `vw_gastos_mensais`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_gastos_mensais` AS select `lancamentos`.`ID_LANC` AS `ID_GASTO_MENSAL`,sum(`lancamentos`.`VALOR`) AS `VALOR`,year(`lancamentos`.`DATA_HORA`) AS `ANO`,case month(`lancamentos`.`DATA_HORA`) when 1 then 'Janeiro' when 2 then 'Fevereiro' when 3 then 'Março' when 4 then 'Abril' when 5 then 'Maio' when 6 then 'Junho' when 7 then 'Julho' when 8 then 'Agosto' when 9 then 'Setembro' when 10 then 'Outubro' when 11 then 'Novembro' when 12 then 'Dezembro' end AS `MES`,`lancamentos`.`DATA_HORA` AS `DATA_HORA`,(select coalesce(sum(`recebidos`.`VALOR`),0) from `lancamentos` `recebidos` where `recebidos`.`STATUS_LANC` = 'Recebido' and `recebidos`.`ID_CCUSTO` not in (19,51) and `recebidos`.`D_E_L_E_T_` <> '*' and year(`recebidos`.`DATA_HORA`) = year(`lancamentos`.`DATA_HORA`) and month(`recebidos`.`DATA_HORA`) = month(`lancamentos`.`DATA_HORA`)) AS `VALOR_RECEBIDO_MES`,(select coalesce(sum(`recebidos`.`VALOR`),0) from `lancamentos` `recebidos` where `recebidos`.`STATUS_LANC` = 'Recebido' and `recebidos`.`ID_CCUSTO` not in (19,51) and `recebidos`.`D_E_L_E_T_` <> '*' and year(`recebidos`.`DATA_HORA`) = year(`lancamentos`.`DATA_HORA`) and month(`recebidos`.`DATA_HORA`) = month(`lancamentos`.`DATA_HORA`)) - sum(`lancamentos`.`VALOR`) AS `SOBRA_MES`,`lancamentos`.`ID_USUARIO` AS `ID_USUARIO` from `lancamentos` where `lancamentos`.`STATUS_LANC` = 'Pago' and `lancamentos`.`ID_CCUSTO` not in (19,51) and `lancamentos`.`D_E_L_E_T_` <> '*' group by year(`lancamentos`.`DATA_HORA`),monthname(`lancamentos`.`DATA_HORA`) order by `lancamentos`.`DATA_HORA`;

-- Copiando estrutura para view gestaofinanceira.vw_lancamentos
-- Removendo tabela temporária e criando a estrutura VIEW final
DROP TABLE IF EXISTS `vw_lancamentos`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_lancamentos` AS select `lanc`.`ID_LANC` AS `ID_LANC`,`lanc`.`DATA_HORA` AS `DATA_HORA`,case dayofweek(`lanc`.`DATA_HORA`) when '1' then 'Domingo' when '2' then 'Segunda-Feira' when '3' then 'Terça-Feira' when '4' then 'Quarta-Feira' when '5' then 'Quinta-Feira' when '6' then 'Sexta-Feira' when '7' then 'Sábado' end AS `DIAS_SEMANA`,`lanc`.`VALOR` AS `VALOR`,`lanc`.`DESCRICAO` AS `DESCRICAO`,`lanc`.`ID_CCUSTO` AS `ID_CCUSTO`,`cc`.`DESCRI` AS `DESCRI_CC`,`lanc`.`STATUS_LANC` AS `STATUS_LANC`,`lanc`.`ID_USUARIO` AS `ID_USUARIO` from (`lancamentos` `lanc` join `ccusto` `cc` on(`lanc`.`ID_CCUSTO` = `cc`.`ID_CCUSTO`)) where `lanc`.`D_E_L_E_T_` <> '*' and `cc`.`D_E_L_E_T_` <> '*' order by `lanc`.`DATA_HORA` desc;

-- Copiando estrutura para view gestaofinanceira.vw_saldos_investimentos
-- Removendo tabela temporária e criando a estrutura VIEW final
DROP TABLE IF EXISTS `vw_saldos_investimentos`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_saldos_investimentos` AS select `lancamentos`.`ID_LANC` AS `ID_SALDO`,if((select `saldos`.`SALDO` from `saldos` order by `saldos`.`DATA_HORA` desc,`saldos`.`ID_LANC` desc limit 1) is null,0,(select `saldos`.`SALDO` from `saldos` order by `saldos`.`DATA_HORA` desc,`saldos`.`ID_LANC` desc limit 1)) AS `SALDO`,if((select sum(`saldos`.`VALORLAN`) from `saldos` where `saldos`.`CCUSTO` = 'Investimento Fixo') is null,0,(select sum(`saldos`.`VALORLAN`) from `saldos` where `saldos`.`CCUSTO` = 'Investimento Fixo')) AS `INVESTIMENTO_FIXO`,if((select sum(`saldos`.`VALORLAN`) from `saldos` where `saldos`.`CCUSTO` = 'Investimento Variável') is null,0,(select sum(`saldos`.`VALORLAN`) from `saldos` where `saldos`.`CCUSTO` = 'Investimento Variável')) AS `INVESTIMENTO_VARIAVEL`,`lancamentos`.`ID_USUARIO` AS `ID_USUARIO` from `lancamentos` limit 1;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
