const express = require("express");
const { conectarOracle } = require("./database");

const router = express.Router();

const COLUNAS = `ID, TITLE, DESCRIPTION, CONTENT, AUTHOR_NAME,
  TO_CHAR(CREATED_AT, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"')`;

// Mesmo formato do antigo src/data/articles.json, para o app não mudar de modelo
function montarArtigo(row, tags) {
  const [id, title, description, content, authorName, createdAt] = row;
  return { id, title, description, content, authorName, createdAt, tags };
}

async function buscarTags(connection, artigoId) {
  const resultado = await connection.execute(
    `SELECT T_ARTICLE_ID, TAG FROM T_ARTICLE_TAG
      ${artigoId ? "WHERE T_ARTICLE_ID = :artigoId" : ""}
      ORDER BY TAG`,
    artigoId ? { artigoId } : {},
  );

  const tags = new Map();
  for (const [id, tag] of resultado.rows) {
    if (!tags.has(id)) tags.set(id, []);
    tags.get(id).push(tag);
  }
  return tags;
}

// Artigos da Home, do mais recente para o mais antigo
router.get("/", async (req, res) => {
  let connection;

  try {
    connection = await conectarOracle();

    const resultado = await connection.execute(
      `SELECT ${COLUNAS} FROM T_ARTICLE ORDER BY CREATED_AT DESC`,
    );
    const tags = await buscarTags(connection);

    res.json({
      sucesso: true,
      artigos: resultado.rows.map((row) => montarArtigo(row, tags.get(row[0]) ?? [])),
    });
  } catch (error) {
    console.error("Erro ao listar artigos:", error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar artigos no Oracle.",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.get("/:id", async (req, res) => {
  let connection;

  try {
    const artigoId = Number(req.params.id);

    if (!Number.isInteger(artigoId) || artigoId <= 0) {
      return res.status(400).json({ sucesso: false, mensagem: "ID do artigo inválido." });
    }

    connection = await conectarOracle();

    const resultado = await connection.execute(
      `SELECT ${COLUNAS} FROM T_ARTICLE WHERE ID = :artigoId`,
      { artigoId },
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Artigo não encontrado." });
    }

    const tags = await buscarTags(connection, artigoId);

    res.json({
      sucesso: true,
      artigo: montarArtigo(resultado.rows[0], tags.get(artigoId) ?? []),
    });
  } catch (error) {
    console.error("Erro ao buscar artigo:", error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar artigo no Oracle.",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
