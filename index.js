const { Asciize, Degradr } = require("asciist");
const config = require("./config.json");
const fs = require("fs");
const path = require("path");
const request = require("request");
const Twit = require("twit");

const sendImage = options => {
	return new Promise((resolve, reject) => {
		const t = new Twit({
			consumer_key: config.twitter.consumer_key,
			consumer_secret: config.twitter.consumer_secret,
			access_token: config.twitter.access_token,
			access_token_secret: config.twitter.access_token_secret
		});
		t.post(
			"media/upload",
			{
				media_data: fs.readFileSync(options.outputFilePath, {
					encoding: "base64"
				})
			},
			(err, data, response) => {
				const mediaId = data.media_id_string;
				const mediaMetaParams = {
					media_id: mediaId,
					alt_text: {
						text: options.objectData.title
					}
				};
				t.post(
					"media/metadata/create",
					mediaMetaParams,
					(err, data, response) => {
						const params = {
							status: `From "${
								options.objectData.title
							}" at the Cooper Hewitt: ${
								options.objectData.url
							}.`,
							media_ids: [mediaId]
						};
						t.post(
							"statuses/update",
							params,
							(err, data, response) => {
								resolve(options);
							}
						);
					}
				);
			}
		);
	});
};

const degradeImage = options => {
	return new Promise((resolve, reject) => {
		const { fileName } = options;
		const fileNameArray = fileName.split(".");
		const degradr = new Degradr();
		const gifFilePath = path.join(
			process.cwd(),
			`.${fileNameArray[1]}.gif`
		);
		degradr
			.run({
				inputFilePath: fileName,
				maxPixelSize: 1000,
				outputFilePath: gifFilePath,
				sizes: [
					350,
					300,
					250,
					210,
					170,
					140,
					110,
					90,
					70,
					60,
					50,
					45,
					40,
					35,
					30,
					25,
					20,
					15,
					10,
					9,
					8,
					7,
					6,
					5,
					4,
					3,
					2,
					1
				]
			})
			.then(() => {
				options.outputFilePath = gifFilePath;
				resolve(options);
			})
			.catch(err => reject(err));
	});
};

const getRandomImage = () => {
	return new Promise((resolve, reject) => {
		const apiBaseUrlFragment =
			"https://api.collection.cooperhewitt.org/rest/";
		const apiQueryUrlFragment =
			"?method=cooperhewitt.objects.getRandom&has_image=1&access_token=";
		const url = `${apiBaseUrlFragment}${apiQueryUrlFragment}${
			config.cooperHewitt.accessToken
		}`;
		request.get(url, (error, response, body) => {
			if (response.statusCode === 200) {
				const data = JSON.parse(body);
				if (
					data.object &&
					data.object.images &&
					data.object.images.length > 0 &&
					data.object.images[0].b
				) {
					const imageUrl = data.object.images[0].b.url;
					const imageUrlArray = imageUrl.split(".");
					const fileFormat = imageUrlArray[imageUrlArray.length - 1];
					const fileName = `./tmp/${data.object.id}.${fileFormat}`;
					if (fileFormat === "png" || fileFormat === "jpg") {
						request.get(imageUrl).pipe(
							fs.createWriteStream(fileName).on("finish", () => {
								resolve({
									fileName: fileName,
									objectData: data.object
								});
							})
						);
					} else {
						rejct();
					}
				} else {
					reject();
				}
			} else {
				reject();
			}
		});
	});
};

const tweet = () => {
	getRandomImage()
		.then(degradeImage)
		.then(sendImage)
		.then(options => {
			console.log("Tweet posted.");
			fs.unlinkSync(options.outputFilePath);
			fs.unlinkSync(options.fileName);
		})
		.catch(err => {
			console.log(err);
		});
};

tweet();
setInterval(tweet, 43200000 / 2);
