const express = require("express");
const cors = require("cors");
const PORT = 3000;
const getTranslation = require("./translate");
const getResponseFromBigBrother = require("./openai");

const app = express();

app.set("view engine", "ejs");

app.listen(PORT);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
	res.render("index");
});

app.post("/getResponse", async (req, res) => {
	const { question } = req.body;

	console.log(question);

	const response = await getTranslation("uz", "en", question);
	const translatedText = response[0][0][0];
	if (!translatedText) {
		return;
	}

	let bbresponse = await getResponseFromBigBrother(translatedText);

	let uzbResponse = await getTranslation(
		"en",
		"uz",
		bbresponse.choices.map((item) => item.text).join("\n")
	);

	const lresponse = uzbResponse[0].map((item) => item[0]).join("\n");

	res.json({
		response: lresponse,
	});
});
