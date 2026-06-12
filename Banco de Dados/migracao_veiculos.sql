
USE ProjetoVeiculo;
GO

ALTER TABLE Veiculos
    ADD Marca               VARCHAR(100)    NULL,
        Modelo              VARCHAR(100)    NULL,
        Ano                 INT             NULL,
        Preco               DECIMAL(18, 2)  NULL,
        Cor                 VARCHAR(50)     NULL,
        Quilometragem       INT             NULL,
        Combustivel         VARCHAR(50)     NULL,
        Cambio              VARCHAR(50)     NULL,
        NumeroPortas        INT             NULL,
        Potencia            VARCHAR(50)     NULL,
        CapacidadePassageiros INT           NULL,
        Descricao           VARCHAR(2000)   NULL;
GO

SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Veiculos'
ORDER BY ORDINAL_POSITION;
GO
