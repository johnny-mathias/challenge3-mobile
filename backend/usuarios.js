const express = require("express");
const { conectarOracle } = require("./database");

const router = express.Router();

// Perfil (role) do usuário no Oracle, a partir de T_USER_PROFILE.PROFILE_TYPE.
// Quem não tem perfil ADMIN é tratado como usuário comum (TUTOR).
router.get("/perfil", async (req, res) => {
  let connection;

  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "O e-mail é obrigatório.",
      });
    }

    connection = await conectarOracle();

    const resultado = await connection.execute(
      `SELECT COUNT(*)
         FROM T_USER u
         JOIN T_USER_PROFILE p ON p.T_USER_ID = u.ID
        WHERE LOWER(u.EMAIL) = LOWER(:email)
          AND p.PROFILE_TYPE = 'ADMIN'
          AND NVL(p.IS_ACTIVE, 'S') = 'S'`,
      { email },
    );

    res.json({
      sucesso: true,
      perfil: resultado.rows[0][0] > 0 ? "ADMIN" : "TUTOR",
    });
  } catch (error) {
    console.error("Erro ao consultar perfil:", error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao consultar perfil no Oracle.",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
