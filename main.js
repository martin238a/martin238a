const { Client } = require("pg");
const express = require("express");
const morgan = require("morgan"); // Some nice logging

/**
 * Følgende parametre bruges til at forbinde til databasen.
 * PORT er den port som webserveren her kører på.
 * DB_USER er brugernavnet til databasen.
 * DB_HOST er serveren som databasen kører på. Enten localhost eller en anden server.
 * DB_NAME er det navn som databasen har.
 * DB_PW er password til DB_USER.
 * DB_PORT er porten til databasen. Det plejer at være 5432, så den behøver man nok ikke ændre.
 */
const PORT = process.env.PORT || 8080;
const DB_USER = process.env.DB_USER || "kdorland";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_NAME = process.env.DB_NAME || "kristians-database";
const DB_PW = process.env.DB_PW || "password";
const DB_PORT = process.env.DB_PORT || 5432;

/**
 * I stedet for at ændre på DB-værdierne i koden herover, er det bedre at gøre det som
 * en del af den måde man kører programmet på. Hver DB-værdi kan sættes i terminalen
 * inden man kører programmet. Det gør man sådan her:
 * 
 * $ export DB_NAME="kristians-database"
 * 
 * Nu er DB_NAME sat til "kristians-database" når programmet kører, uden at man har
 * ændret i JavaScript-koden. Dette skal gøres hver gang du åbner en ny terminal.
 * Det skal helst gøres både for DB_NAME, DB_PW, DB_USER og DB_HOST.
 * PORT og DB_PORT plejer man ikke at ændre.
 */
if (!process.env.DB_NAME || !process.env.DB_PW || !process.env.DB_USER) {
  console.warn("Husk at sætte databasenavn, password og user via env vars.");
  console.warn("Eksempel på at sætte databasenavn i terminalen:");
  console.warn(`export DB_NAME="kristians-database"`);
  console.warn("Lige nu er databasenavn sat til:", DB_NAME);
} else {
  console.log("Postgres database:", DB_NAME);
  console.log("Postgres user:", DB_USER);
}

/*
 * Herunder laves web-serveren. Den indeholder din html (fra public-folderen)
 * og API'en så der er forbindelse videre til databasen fra JavaScript. Det er "to i en".
 */
const app = express();
const client = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PW,
  port: DB_PORT
});
client.connect();

app.use(express.text());
app.use(express.static("public"))
app.use(morgan("combined")); 

/*
 * Her defineres API'en.
 * Man laver lige så mange endpoints man har lyst til. Jeg har lavet et enkelt til
 * querien `SELECT 'Hello, World' as message`.
 */
app.post("/api/urbanisering", async (req, res) => {
  try {
    // Lav query
    const query = `SELECT
    urbanisering.urbanbefolkningprocentdel,
    doedsrate.doedsrate, 
    adgangtilrentvand.ikkeadgangtilrentvand,
    urbanisering.land
    FROM urbanisering
    LEFT JOIN doedsrate
    ON doedsrate.land=urbanisering.land
    LEFT JOIN adgangtilrentvand
    ON adgangtilrentvand.land=urbanisering.land
    WHERE ikkeadgangtilrentvand is not null and urbanbefolkningprocentdel is not null and urbanisering.land IN ('Nigeria', 'Somalia','African Republic','Liberia','India','Pakistan','Brazil','Denmark','China','Russia','United Kingdom','United States')`;

    
    queryData = await client.query(query);
    // Giv svar tilbage til JavaScript
    res.json({
      "ok": true,
      "data": queryData.rows,
    })
  } catch (error) {
    // Hvis query fejler, fanges det her.
    // Send fejlbesked tilbage til JavaScript
    res.json({
      "ok": false,
      "message": error.message,
    })
  }

})
app.post("/api/laesefaerdighed", async (req, res) => {
  try {
    // Lav query
    const query = `SELECT
    laesefaerdighed.laesefaerdighedsrate,
    doedsrate.doedsrate, 
    adgangtilrentvand.ikkeadgangtilrentvand,
    laesefaerdighed.land
    FROM laesefaerdighed
    LEFT JOIN doedsrate
    ON doedsrate.land=laesefaerdighed.land
    LEFT JOIN adgangtilrentvand
    ON adgangtilrentvand.land=laesefaerdighed.land
    WHERE laesefaerdighedsrate is not null and ikkeadgangtilrentvand is not null and laesefaerdighed.land IN ('Nigeria', 'Somalia','African Republic','Liberia','India','Pakistan','Brazil','Denmark','China','Russia','United Kingdom','United States')`;
    queryData = await client.query(query);
    // Giv svar tilbage til JavaScript
    res.json({
      "ok": true,
      "data": queryData.rows,
    })
  } catch (error) {
    // Hvis query fejler, fanges det her.
    // Send fejlbesked tilbage til JavaScript
    res.json({
      "ok": false,
      "message": error.message,
    })
  }

})
app.post("/api/antalaariskole", async (req, res) => {
  try {
    // Lav query
    const query = `SELECT
    antalaariskole.gennemsnitligtantalaariskole,
    doedsrate.doedsrate, 
    adgangtilrentvand.ikkeadgangtilrentvand,
    antalaariskole.land
    FROM antalaariskole
    LEFT JOIN doedsrate
    ON doedsrate.land=antalaariskole.land
    LEFT JOIN adgangtilrentvand
    ON adgangtilrentvand.land=antalaariskole.land
    WHERE gennemsnitligtantalaariskole is not null and ikkeadgangtilrentvand is not null and antalaariskole.land IN ('Nigeria', 'Somalia','African Republic','Liberia','India','Pakistan','Brazil','Denmark','China','Russia','United Kingdom','United States')`;
    queryData = await client.query(query);
    // Giv svar tilbage til JavaScript
    res.json({
      "ok": true,
      "data": queryData.rows,
    })
  } catch (error) {
    // Hvis query fejler, fanges det her.
    // Send fejlbesked tilbage til JavaScript
    res.json({
      "ok": false,
      "message": error.message,
    })
  }

})
app.post("/api/fattighedgraense", async (req, res) => {
  try {
    // Lav query
    const query = `SELECT
    fattighedsgraense.procentdelafbefolkningunderfattighedsgraense,
    doedsrate.doedsrate, 
    adgangtilrentvand.ikkeadgangtilrentvand,
    fattighedsgraense.land
    FROM fattighedsgraense
    LEFT JOIN doedsrate
    ON doedsrate.land=fattighedsgraense.land
    LEFT JOIN adgangtilrentvand
    ON adgangtilrentvand.land=fattighedsgraense.land
    WHERE procentdelafbefolkningunderfattighedsgraense is not null and ikkeadgangtilrentvand is not null and fattighedsgraense.land IN ('Nigeria', 'Somalia','African Republic','Liberia','India','Pakistan','Brazil','Denmark','China','Russia','United Kingdom','United States')`;
    queryData = await client.query(query);
    // Giv svar tilbage til JavaScript
    res.json({
      "ok": true,
      "data": queryData.rows,
    })
  } catch (error) {
    // Hvis query fejler, fanges det her.
    // Send fejlbesked tilbage til JavaScript
    res.json({
      "ok": false,
      "message": error.message,
    })
  }

})
app.post("/api/korruption", async (req, res) => {
  try {
    // Lav query
    const query = `SELECT
    korruption.korruptionsindex,
    doedsrate.doedsrate, 
    adgangtilrentvand.ikkeadgangtilrentvand,
    korruption.land
    FROM korruption
    LEFT JOIN doedsrate
    ON doedsrate.land=korruption.land
    LEFT JOIN adgangtilrentvand
    ON adgangtilrentvand.land=korruption.land
    WHERE korruptionsindex is not null and ikkeadgangtilrentvand is not null and korruption.land IN ('Nigeria', 'Somalia','African Republic','Liberia','India','Pakistan','Brazil','Denmark','China','Russia','United Kingdom','United States')`;
    queryData = await client.query(query);
    // Giv svar tilbage til JavaScript
    res.json({
      "ok": true,
      "data": queryData.rows,
    })
  } catch (error) {
    // Hvis query fejler, fanges det her.
    // Send fejlbesked tilbage til JavaScript
    res.json({
      "ok": false,
      "message": error.message,
    })
  }

});

// Web-serveren startes.
app.listen(PORT, () => console.log(`Serveren kører på http://localhost:${PORT}`));