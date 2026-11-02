require("dotenv").config();

const animalsRoutes = require("./animals");
const artigosRoutes = require("./artigos");
const especiesRoutes = require("./especies");
const usuariosRoutes = require("./usuarios");

const cors = require("cors");
const express = require("express");
const { conectarOracle } = require("./database");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/animals", animalsRoutes);
app.use("/api/artigos", artigosRoutes);
app.use("/api/especies", especiesRoutes);
app.use("/api/usuarios", usuariosRoutes);

app.get("/api/teste", async (req, res) => {
  let connection;

  try {
    connection = await conectarOracle();

    const result = await connection.execute(
      "SELECT 1 FROM DUAL"
    );

    res.json({
      sucesso: true,
      oracle: true,
      resultado: result.rows[0][0]
    });

  } catch (error) {
    console.error("Erro na conexão Oracle:", error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Falha ao conectar ao Oracle"
    });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API executando em http://localhost:${PORT}`);
});