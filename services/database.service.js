const initialConnection = async ({client}) => {
	try {
		await client.connect();
		console.log(client.db);
	} catch {
		console.log(await client.connect())
	}
}

module.exports = {initialConnection};