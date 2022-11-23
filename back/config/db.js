const mysql = require('mysql');
require('dotenv').config();
const randomProfile = require('random-profile-generator');
const bcrypt = require('bcrypt');


const tags = [
	'Advertising',
	'Agriculture',
	'Architecture',
	'Aviation',
	'Banking',
	'Business',
	'Construction',
	'Design',
	'Economics',
	'Engineering',
	'Entrepreneurship',
	'Management',
	'Marketing',
	'Nursing',
	'Online',
	'Web',
	'Creditcards',
	'Insurance',
	'Investment',
	'Retail',
	'Sales',
	'Science',
	'Accounting',
	'Acting',
	'Art',
	'Artificialintelligence',
	'Audio',
	'Automotive',
	'Beauty',
	'Biotechnology',
	'Chemistry',
	'Clothing',
	'Comics',
	'Computers',
	'Cooking',
	'Cosmetics',
	'Dance',
	'Design',
	'Digital',
	'Education',
	'Electronics',
	'Energy',
	'Entertainment',
	'Environment',
	'Fashion',
	'Film',
	'Finance',
	'Food',
	'Gaming',
	'Gardening',
	'Graphicdesign',
	'Health',
	'History',
	'Home',
	'Humanresources',
	'Industrial',
	'Information',
	'Internet',
	'Journalism',
	'Law',
	'Literature',
	'Media',
	'Medicine',
	'Music',
	'Nature',
	'News',
	'Nutrition',
	'Painting',
	'Photography',
	'Physics',
	'Poetry',
	'Politics',
	'Psychology',
	'Recipes',
	'Religion',
	'Science',
	'Software',
	'Sports',
	'Technology',
	'Travel',
	'Video',
	'Writing',
	'3D',
	'Ballet',
	'Bars',
	'Concerts',
	'Dancehalls',
	'Nightclubs',
	'Parties',
	'Plays',
	'Theatre', 
	'Flatearth',
	'Dnb',
	'Edm',
	'Dubstep',
	'Jeans',
	'Tuning',
	'K-Pop',
	'Kungfu'
	];

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	queueLimit : 15000
});

con.connect((err) => {
	async function createTables() {
		if (err) throw err;
		con.query("CREATE DATABASE IF NOT EXISTS matcha", function (err, result) {
			if (err) throw err;
			if (result.warningCount > 0)
				console.log('\x1b[36m%s\x1b[0m', "Database already exists");
			else
				console.log('\x1b[36m%s\x1b[0m', "Database created");
		});

		con.query("USE matcha", function (err, result) {
			if (err) throw err;
			console.log("\x1b[35m", "Using matcha db");
		});

		let sql = "CREATE TABLE IF NOT EXISTS users (id INT(11) AUTO_INCREMENT PRIMARY KEY,\
		name VARCHAR(20),\
		lastName VARCHAR(20),\
		username VARCHAR(50),\
		email VARCHAR(200),\
		password VARCHAR(250),\
		gender VARCHAR(7),\
		bio VARCHAR(500),\
		birthday DATE,\
		preference VARCHAR(13),\
		interests JSON,\
		score INT(11) DEFAULT 0,\
		acti_stat INT (11) default 0,\
		notif_stat BOOLEAN default 1,\
		activation_token VARCHAR(250),\
		registration_date DATETIME DEFAULT NOW());";

		con.query(sql, (err, result) => {
			if (err) throw err;
			if (result.warningCount > 0)
				console.log('\x1b[36m%s\x1b[0m', "users table already exists");
			else
				console.log('\x1b[36m%s\x1b[0m', "users tale created");
		});

		sql = "CREATE TABLE IF NOT EXISTS user_pictures \
		(id INT(11) AUTO_INCREMENT PRIMARY KEY,\
		user_id INT(11) UNIQUE,\
		pic_1 VARCHAR(60),\
		pic_2 VARCHAR(60),\
		pic_3 VARCHAR(60),\
		pic_4 VARCHAR(60),\
		pic_5 VARCHAR(60));";

		
		con.query(sql, (err, result) => {
			if (err) throw err;
			if (result.warningCount > 0)
				console.log('\x1b[36m%s\x1b[0m', "user_picture table already exists");
			else
				console.log('\x1b[36m%s\x1b[0m', "user_pictures tale created");
		});

		sql = "CREATE TABLE IF NOT EXISTS locations \
		(id INT(11) AUTO_INCREMENT PRIMARY KEY,\
		user_id INT(11) UNIQUE,\
		gps_location POINT,\
		ip_location POINT,\
		user_set_location POINT,\
		user_set_city VARCHAR(50),\
		gps_city VARCHAR(50),\
		ip_city VARCHAR(50));";

		
		con.query(sql, (err, result) => {
			if (err) throw err;
			if (result.warningCount > 0)
				console.log('\x1b[36m%s\x1b[0m', "locations table already exists");
			else
				console.log('\x1b[36m%s\x1b[0m', "locations tale created");
		});

		sql = "CREATE TABLE IF NOT EXISTS notifications \
		(id INT(11) AUTO_INCREMENT PRIMARY KEY,\
		`from` INT(11),\
		`to` INT(11),\
		content VARCHAR(60),\
		`read` BOOLEAN,\
		time DATETIME DEFAULT NOW());";

		
		con.query(sql, (err, result) => {
			if (err) throw err;
			if (result.warningCount > 0)
				console.log('\x1b[36m%s\x1b[0m', "notifications table already exists");
			else
				console.log('\x1b[36m%s\x1b[0m', "notifications tale created");
		});

		sql = "CREATE TABLE IF NOT EXISTS loggedInUsers \
		(id INT(11) AUTO_INCREMENT PRIMARY KEY,\
		user_id INT(11),\
		time DATETIME DEFAULT NOW());";

		
		con.query(sql, (err, result) => {
			if (err) throw err;
			if (result.warningCount > 0)
				console.log('\x1b[36m%s\x1b[0m', "loggedInUsers table already exists");
			else
				console.log('\x1b[36m%s\x1b[0m', "loggedInUsers tale created");
		});

		sql = "CREATE TABLE IF NOT EXISTS tags \
		(id INT(11) AUTO_INCREMENT PRIMARY KEY,\
		tag VARCHAR(30))";

		con.query(sql, (err, result) => {
			if (err) throw err;
			if (result.warningCount > 0)
				console.log('\x1b[36m%s\x1b[0m', "tags table already exists");
			else {
				console.log('\x1b[36m%s\x1b[0m', "tags table created");
				tags.forEach((tag) => {
					db.query(`INSERT INTO tags (tag) VALUES (?)`, [tag], (err, result) => {
						if (err) throw err;
						});
					});
				}
		});
		sql = "CREATE TABLE IF NOT EXISTS matches (id INT(11) AUTO_INCREMENT PRIMARY KEY, user1 INT(11), user2 INT(11), like1 BOOLEAN, like2 BOOLEAN, matched BOOLEAN, block BOOLEAN);";
		con.query(sql, (error, resutl) => {
			if (error) throw error;
			else console.log('match table')
		})
		sql = "CREATE TABLE IF NOT EXISTS chatrooms (id INT(11) AUTO_INCREMENT PRIMARY KEY, user1 INT(11), user2 INT(11));"
		con.query(sql, (error, resutl) => {
			if (error) throw error;
			else console.log('chatroom table')
		})
		sql = "CREATE TABLE IF NOT EXISTS messages (id INT(11) AUTO_INCREMENT PRIMARY KEY, chatroom_id INT(11), sender INT(11), body VARCHAR(420), seen BOOLEAN DEFAULT FALSE, time DATETIME DEFAULT NOW());";
		con.query(sql, (error, resutl) => {
			if (error) throw error;
			else console.log('messages table')
		})
	}
	createTables().then(() => {
	const womenPics = [
		'./profilePics/photo-1422544834386-d121ef7c6ea8.jpeg',
		'./profilePics/photo-1439902315629-cd882022cea0.jpeg',
		'./profilePics/photo-1464629093290-33d3e39ccbfa.jpeg',
		'./profilePics/photo-1465062906905-dde9edafabd5.jpeg',
		'./profilePics/photo-1468186376524-b53e47314061.jpeg',
		'./profilePics/photo-1470784694193-00f44d7b9374.jpeg',
		'./profilePics/photo-1475049120922-5fd74aecbfe9.jpeg',
		'./profilePics/photo-1475204257634-df83964505c0.jpeg',
		'./profilePics/photo-1479936343636-73cdc5aae0c3.jpeg',
		'./profilePics/photo-1484186139897-d5fc6b908812.jpeg',
		'./profilePics/photo-1484186694682-a940e4b1a9f7.jpeg',
		'./profilePics/photo-1485290334039-a3c69043e517.jpeg',
		'./profilePics/photo-1485727749690-d091e8284ef3.jpeg',
		'./profilePics/photo-1485893086445-ed75865251e0.jpeg',
		'./profilePics/photo-1486302913014-862923f5fd48.jpeg',
		'./profilePics/photo-1491898487514-29e95d92e3f9.jpeg',
		'./profilePics/photo-1493752958643-f1d526ff654f.jpeg',
		'./profilePics/photo-1495580621852-5de0cc907d2f.jpeg',
		'./profilePics/photo-1496439786094-e697ca3584d0.jpeg',
		'./profilePics/photo-1497914483548-9f8e6c1a812a.jpeg',
		'./profilePics/photo-1499887142886-791eca5918cd.jpeg',
		'./profilePics/photo-1502877828070-33b167ad6860.jpeg',
		'./profilePics/photo-1504505278590-428d1acd0f07.jpeg',
		'./profilePics/photo-1505898471925-388302245eaa.jpeg',
		'./profilePics/photo-1507675841101-8c757cb4cc6d.jpeg',
		'./profilePics/photo-1509335035496-c47fc836517f.jpeg',
		'./profilePics/photo-1511763368359-c0d890ede0c2.jpeg',
		'./profilePics/photo-1511821057783-3edeee215a67.jpeg',
		'./profilePics/photo-1512518607807-17e94dc9a5d0.jpeg',
		'./profilePics/photo-1513690277738-c9bc7eb2a992.jpeg',
		'./profilePics/photo-1514997789755-30a35f9983e1.jpeg',
		'./profilePics/photo-1515463892140-58a22e37ff72.jpeg',
		'./profilePics/photo-1517174228281-88bc12c11758.jpeg',
		'./profilePics/photo-1519589356351-4f5bb9dc77d6.jpeg',
		'./profilePics/photo-1521058791370-fa849b7d56cb.jpeg',
		'./profilePics/photo-1524041255072-7da0525d6b34.jpeg',
		'./profilePics/photo-1524160741206-983df146510a.jpeg',
		'./profilePics/photo-1525641042653-e0caa0dffdd1.jpeg',
		'./profilePics/photo-1525888684675-ceb3be622daa.jpeg',
		'./profilePics/photo-1526382925646-27b5eb86796e.jpeg',
		'./profilePics/photo-1526391922840-891b87f9af1b.jpeg',
		'./profilePics/photo-1526604330406-5fc5bf5224e4.jpeg',
		'./profilePics/photo-1526621553736-d0cfb8b59b76.jpeg',
		'./profilePics/photo-1528488027800-2e38940e6f51.jpeg',
		'./profilePics/photo-1529983118521-c801f13d8cd0.jpeg',
		'./profilePics/photo-1530650068191-e80dcd5ee0b7.jpeg',
		'./profilePics/photo-1531375463032-b85595656924.jpeg',
		'./profilePics/photo-1534125804993-544a1148a064.jpeg',
		'./profilePics/photo-1534126416832-a88fdf2911c2.jpeg',
		'./profilePics/photo-1534945773093-1119ae5684ab.jpeg',
		'./profilePics/photo-1534954553104-88cb75be7648.jpeg',
		'./profilePics/photo-1535548444462-942602e41b98.jpeg',
		'./profilePics/photo-1535953472862-9cc610a70f8a.jpeg',
		'./profilePics/photo-1536344539068-d2e26c8dd3fe.jpeg',
		'./profilePics/photo-1542157585-ef20bfcce579.jpeg',
		'./profilePics/photo-1542488586-13e4ad0330a2.jpeg',
		'./profilePics/photo-1542507426755-0a6dac707045.jpeg',
		'./profilePics/photo-1543813092-6d825ed30039.jpeg',
		'./profilePics/photo-1547212371-eb5e6a4b590c.jpeg',
		'./profilePics/photo-1552162864-987ac51d1177.jpeg',
		'./profilePics/photo-1554244933-d876deb6b2ff.jpeg',
		'./profilePics/photo-1557160860-d605d43ab086.jpeg',
		'./profilePics/photo-1557939706-fcc0ea82a221.jpeg',
		'./profilePics/photo-1560579183-5a1786c68413.jpeg',
		'./profilePics/photo-1564164841584-391b5c7b590c.jpeg',
		'./profilePics/photo-1572803124538-b039f453f00b.jpeg',
		'./profilePics/photo-1575042179444-2f5c4f87c0d5.jpeg',
		'./profilePics/photo-1577897113176-6888367369bf.jpeg',
		'./profilePics/photo-1582533552406-234434284c17.jpeg',
		'./profilePics/photo-1584090170129-4d74e3634910.jpeg',
		'./profilePics/photo-1585399090149-de01d4c28e70.jpeg',
		'./profilePics/photo-1591034455539-0352f7ed55ee.jpeg',
		'./profilePics/photo-1591581165886-446003096cc2.jpeg',
		'./profilePics/photo-1591729458470-00f6ff7b3073.jpeg',
		'./profilePics/photo-1592833578500-1082e18665a3.jpeg',
		'./profilePics/photo-1593439411281-6500cf61961c.jpeg',
		'./profilePics/photo-1595687825617-10c4d36566e7.jpeg',
		'./profilePics/photo-1597223557154-721c1cecc4b0.jpeg',
		'./profilePics/photo-1597248374161-426f0d6d2fc9.jpeg',
		'./profilePics/photo-1598296885460-5db81b1e33b9.jpeg',
		'./profilePics/photo-1599350901064-2280ec14d016.jpeg',
		'./profilePics/photo-1600599351626-87228b0f2ba2.jpeg',
		'./profilePics/photo-1601747716660-572505b8d86f.jpeg',
		'./profilePics/photo-1604804531906-3c65b52e0681.jpeg',
		'./profilePics/photo-1606827728401-939ad3483e7b.jpeg',
		'./profilePics/photo-1609600078461-4f1a5d65d850.jpeg',
		'./profilePics/photo-1612847759772-17b4d420af34.jpeg',
		'./profilePics/photo-1613583016662-09f4040d7d04.jpeg',
		'./profilePics/photo-1614113819643-ac5655bc44f2.jpeg',
		'./profilePics/photo-1615125946289-16298a82d3c3.jpeg',
		'./profilePics/photo-1616840420121-7ad8ed885f11.jpeg',
		'./profilePics/photo-1617200785733-6237c87c9ece.jpeg',
		'./profilePics/photo-1618225782624-5021227fd5d0.jpeg',
		'./profilePics/photo-1618592795475-a3a169db6f87.jpeg',
		'./profilePics/photo-1619020985209-852c1de42d42.jpeg',
		'./profilePics/photo-1619021015773-8c2f6706970a.jpeg',
		'./profilePics/photo-1619021025529-661847b00d1a.jpeg',
		'./profilePics/photo-1622576257671-e053d63771f5.jpeg',
		'./profilePics/photo-1626337920103-ae64b9c688e4.jpeg',
		'./profilePics/photo-1627903713872-e866b876dfb3.jpeg',
		'./profilePics/photo-1627910002390-9312430eabf3.jpeg',
		'./profilePics/photo-1628269096039-4a89eae68d7e.jpeg',
		'./profilePics/photo-1628274910981-d4c6718b1a35.jpeg',
		'./profilePics/photo-1629997391037-c3b5210b5d35.jpeg',
		'./profilePics/photo-1630519771190-6d38076d8903.jpeg',
		'./profilePics/photo-1631201553057-026ccefaa4ca.jpeg',
		'./profilePics/photo-1635512923599-8ac0d3f8873e.jpeg',
		'./profilePics/photo-1643228361635-299f15d87f4f.jpeg',
		'./profilePics/photo-1644356008152-577a7453e7fb.jpeg',
		'./profilePics/photo-1648368247707-2bf80a3b1bb6.jpeg',
		'./profilePics/photo-1649842077980-24c92beb94b6.jpeg',
		'./profilePics/photo-1654086438689-ac593fb9387a.jpeg',
		'./profilePics/photo-1658932447761-8a59cd02d201.jpeg',
		'./profilePics/photo-1659087805683-394473f09b5b.jpeg',
		'./profilePics/photo-1665174286799-5c51dcc9748a.jpeg',
		'./profilePics/photo-1666270336962-875a09eebaa7.jpeg',
	] // 116 images
	const menPics = [
		'./profilePics/photo-1429114753120-0733a750d6c1.jpeg',
		'./profilePics/photo-1449445894928-d3280a99ee12.jpeg',
		'./profilePics/photo-1455264646464-fb8b45ab4c57.jpeg',
		'./profilePics/photo-1483995564125-85915c11dcfe.jpeg',
		'./profilePics/photo-1484186304838-0bf1a8cff81c.jpeg',
		'./profilePics/photo-1484684096794-03e03b5e713e.jpeg',
		'./profilePics/photo-1485206283729-2ca7d035185e.jpeg',
		'./profilePics/photo-1485206412256-701ccc5b93ca.jpeg',
		'./profilePics/photo-1485528562718-2ae1c8419ae2.jpeg',
		'./profilePics/photo-1485893226355-9a1c32a0c81e.jpeg',
		'./profilePics/photo-1489388433353-df7543dd66e9.jpeg',
		'./profilePics/photo-1493752603190-08d8b5d1781d.jpeg',
		'./profilePics/photo-1494158064015-7ff877b5bb2b.jpeg',
		'./profilePics/photo-1495700777292-191db677e401.jpeg',
		'./profilePics/photo-1495844927864-0cb5846bad33.jpeg',
		'./profilePics/photo-1503376735680-a97d491ec716.jpeg',
		'./profilePics/photo-1504364269860-8be73aabdff2.jpeg',
		'./profilePics/photo-1504553101389-41a8f048c3ba.jpeg',
		'./profilePics/photo-1505247964246-1f0a90443c36.jpeg',
		'./profilePics/photo-1505866535066-ccebd6b2b98a.jpeg',
		'./profilePics/photo-1505975410356-cec53a6cdec9.jpeg',
		'./profilePics/photo-1506207803951-1ee93d7256ad.jpeg',
		'./profilePics/photo-1509112756314-34a0badb29d4.jpeg',
		'./profilePics/photo-1510852328951-457a8f54a7f6.jpeg',
		'./profilePics/photo-1511406850240-0ffe42effea8.jpeg',
		'./profilePics/photo-1514218698632-ef079aeae842.jpeg',
		'./profilePics/photo-1514501259756-f4b6fbeffa67.jpeg',
		'./profilePics/photo-1515775356328-191f2e02390e.jpeg',
		'./profilePics/photo-1515991363987-66528702e682.jpeg',
		'./profilePics/photo-1516651029879-bcd191e7d33b.jpeg',
		'./profilePics/photo-1516689807549-04b4c3b4ee35.jpeg',
		'./profilePics/photo-1517544901192-0f8a27fc56a5.jpeg',
		'./profilePics/photo-1517588632672-9758d6acba04.jpeg',
		'./profilePics/photo-1517774622-3557d56f00bf.jpeg',
		'./profilePics/photo-1519758965401-328f73031806.jpeg',
		'./profilePics/photo-1520451644838-906a72aa7c86.jpeg',
		'./profilePics/photo-1522075469751-3a6694fb2f61.jpeg',
		'./profilePics/photo-1523111567642-f71bebeb173f.jpeg',
		'./profilePics/photo-1523478016374-2a27cc521718.jpeg',
		'./profilePics/photo-1523617423-4ee97cdd27f4.jpeg',
		'./profilePics/photo-1524947270643-a6db7e66d593.jpeg',
		'./profilePics/photo-1526248285192-65d8c14dc9db.jpeg',
		'./profilePics/photo-1527980965255-d3b416303d12.jpeg',
		'./profilePics/photo-1529068755536-a5ade0dcb4e8.jpeg',
		'./profilePics/photo-1530031092055-18d4a16ff6e5.jpeg',
		'./profilePics/photo-1531648364449-851d22e5026c.jpeg',
		'./profilePics/photo-1532318065232-2ba7c6676cd5.jpeg',
		'./profilePics/photo-1535713875002-d1d0cf377fde.jpeg',
		'./profilePics/photo-1536792414922-14b978901fcd.jpeg',
		'./profilePics/photo-1541534401786-2077eed87a74.jpeg',
		'./profilePics/photo-1542071910-d36d1cbc379a.jpeg',
		'./profilePics/photo-1542178243-bc20204b769f.jpeg',
		'./profilePics/photo-1542328025-50d8b06fc769.jpeg',
		'./profilePics/photo-1542494553-a6ce0f1f6ece.jpeg',
		'./profilePics/photo-1542909168-6296a31d7689.jpeg',
		'./profilePics/photo-1542909168-82c3e7fdca5c.jpeg',
		'./profilePics/photo-1542909192-2f2241a99c9d.jpeg',
		'./profilePics/photo-1543228014-2f8585c59fd0.jpeg',
		'./profilePics/photo-1548964095-b9a292144866.jpeg',
		'./profilePics/photo-1550101733-1301db7ba32a.jpeg',
		'./profilePics/photo-1550523092-8acb0743bc10.jpeg',
		'./profilePics/photo-1550927312-3af3c565011f.jpeg',
		'./profilePics/photo-1551692702-edf4a1d740bf.jpeg',
		'./profilePics/photo-1551828060-1bcda73c75bb.jpeg',
		'./profilePics/photo-1552774021-9ebbb764f03e.jpeg',
		'./profilePics/photo-1556094896-23de9115a14d.jpeg',
		'./profilePics/photo-1556541516-6df3db2bc84f.jpeg',
		'./profilePics/photo-1559582930-bb01987cf4dd.jpeg',
		'./profilePics/photo-1560266822-3336a59dc719.jpeg',
		'./profilePics/photo-1561688711-a98d0cfd30a2.jpeg',
		'./profilePics/photo-1562124638-724e13052daf.jpeg',
		'./profilePics/photo-1563899958-09f6d0d76342.jpeg',
		'./profilePics/photo-1567476445327-705d1b3780de.jpeg',
		'./profilePics/photo-1569466896818-335b1bedfcce.jpeg',
		'./profilePics/photo-1570295999919-56ceb5ecca61.jpeg',
		'./profilePics/photo-1571429681462-d7b1d8c14758.jpeg',
		'./profilePics/photo-1572262107271-baad9a8c8709.jpeg',
		'./profilePics/photo-1576336092378-414a411f0370.jpeg',
		'./profilePics/photo-1577415608496-b02c3c3677ea.jpeg',
		'./profilePics/photo-1581791538302-03537b9c97bf.jpeg',
		'./profilePics/photo-1584022464805-0e83f7186106.jpeg',
		'./profilePics/photo-1586105086593-553abda668bc.jpeg',
		'./profilePics/photo-1589551767722-8c92536397cf.jpeg',
		'./profilePics/photo-1590834769514-19405b9d7fd5.jpeg',
		'./profilePics/photo-1591452809285-d700668fae4e.jpeg',
		'./profilePics/photo-1591549299905-a71d750df62d.jpeg',
		'./profilePics/photo-1592790807458-d7980c141d90.jpeg',
		'./profilePics/photo-1592961495487-805c73c22198.jpeg',
		'./profilePics/photo-1593032534613-085f25474cae.jpeg',
		'./profilePics/photo-1593508512255-86ab42a8e620.jpeg',
		'./profilePics/photo-1594056113573-f8faae5ac78e.jpeg',
		'./profilePics/photo-1595664248149-94356b1ae05c.jpeg',
		'./profilePics/photo-1595902602507-c59a985fb26d.jpeg',
		'./profilePics/photo-1597471832187-bc44d3c1ac09.jpeg',
		'./profilePics/photo-1597651711127-600d0c2e78b0.jpeg',
		'./profilePics/photo-1598641795816-a84ac9eac40c.jpeg',
		'./profilePics/photo-1600883662955-a82934b7cd65.jpeg',
		'./profilePics/photo-1604246310419-a32e1452a6ce.jpeg',
		'./profilePics/photo-1608127010599-43d44ab72bb1.jpeg',
		'./profilePics/photo-1608649672519-e8797a9560cf.jpeg',
		'./profilePics/photo-1609747221137-251e7bb65f45.jpeg',
		'./profilePics/photo-1610131977625-4b3799104ac0.jpeg',
		'./profilePics/photo-1612448488443-fbf25347e220.jpeg',
		'./profilePics/photo-1613634298233-bf0ed4f5dbd0.jpeg',
		'./profilePics/photo-1614760553312-4fde8eb121bc.jpeg',
		'./profilePics/photo-1615800012385-cfbf5613d765.jpeg',
		'./profilePics/photo-1617140610409-753b80274362.jpeg',
		'./profilePics/photo-1617992131309-1a995b716165.jpeg',
		'./profilePics/photo-1618018352910-72bdafdc82a6.jpeg',
		'./profilePics/photo-1618077360395-f3068be8e001.jpeg',
		'./profilePics/photo-1618155755462-9ec43bd0d5e8.jpeg',
		'./profilePics/photo-1622542101479-4476eaeb6cd5.jpeg',
		'./profilePics/photo-1622554129902-bb01970e2540.jpeg',
		'./profilePics/photo-1623200693945-ec1e9991039a.jpeg',
		'./profilePics/photo-1623660142574-e41079a88c79.jpeg',
		'./profilePics/photo-1623930154261-37f8b293c059.jpeg',
		'./profilePics/photo-1625000022463-bc1f305e1a8d.jpeg',
		'./profilePics/photo-1625055671570-e5de97e4897d.jpeg',
		'./profilePics/photo-1625241152315-4a698f74ceb7.jpeg',
	] // 120 images
	const preferences = ['heterosexual', 'homosexual', 'bisexual'];
	
	const locations = [
	'Helsinki, FI',
	'Espoo, FI',
	'Tampere, FI',
	'Vantaa, FI',
	'Oulu, FI',
	'Turku, FI',
	'Jyväskylä, FI',
	'Kuopio, FI',
	'Lahti, FI',
	'Kouvola, FI',
	'Pori, FI',
	'Joensuu, FI',
	'Lappeenranta, FI',
	'Hämeenlinna, FI',
	'Vaasa, FI',
	'Rovaniemi, FI',
	'Seinäjoki, FI',
	'Mikkeli, FI',
	'Kotka, FI',
	'Salo, FI',
	'Porvoo, FI',
	'Kokkola, FI',
	'Lohja, FI',
	'Hyvinkää, FI',
	'Nurmijärvi, FI',
	'Järvenpää, FI',
	'Rauma, FI',
	'Kirkkonummi, FI',
	'Tuusula, FI',
	'Kajaani, FI',
	'Jyväskylän Maalaiskunta, FI',
	'Savonlinna, FI',
	'Kerava, FI',
	'Nokia, FI'
	]
	// lat lon
	const coordinates = [
	'60.1756 24.9342',
	'60.2100 24.6600',
	'61.4981 23.7608',
	'60.3000 25.0333',
	'65.0142 25.4719',
	'60.4517 22.2700',
	'62.2333 25.7333',
	'62.8925 27.6783',
	'60.9804 25.6550',
	'60.8681 26.7042',
	'61.4847 21.7972',
	'62.6000 29.7639',
	'61.0583 28.1861',
	'61.0000 24.4414',
	'63.1000 21.6167',
	'66.5028 25.7285',
	'62.7903 22.8403',
	'61.6875 27.2736',
	'60.4667 26.9458',
	'60.3831 23.1331',
	'60.3931 25.6639',
	'63.8376 23.1320',
	'60.2500 24.0667',
	'60.6306 24.8597',
	'60.4667 24.8083',
	'60.4722 25.0889',
	'61.1167 21.5000',
	'60.1167 24.4167',
	'60.4028 25.0292',
	'64.2250 27.7333',
	'62.2889 25.7417',
	'61.8667 28.8831',
	'60.4028 25.1000',
	'61.4767 23.5053'
	
	]
	function randomDate(start, end) {
		const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
		let birthday = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
		return (birthday.split("T")[0]);
	}
	
	
	
	let i = 1;
	let iLocation = 0;
	let iMalePictures = 0;
	let iFemalePictures = 0;
	let iPreferences = 0;


	const insertLocationArray = [];
	const insertUsersArray = [];
	const insertPicturesArray = [];
	db.query('SELECT * FROM users', (err, result) => {
		if (err) {
			console.log(err);
		} else if (result.length === 0) {

			while (i < 30) {
				console.log('users generated: ', i)
				let profile = randomProfile.profile();
				if (iLocation === locations.length)
					iLocation = 0;
				if (iMalePictures === menPics.length)
					iMalePictures = 0;
				if (iFemalePictures === womenPics.length)
					iFemalePictures = 0;
				if (iPreferences === preferences.length)
					iPreferences = 0;
				profile.birthday = randomDate(new Date(1954, 0, 1), new Date(2004, 0, 1));
				const getAge = birthday => Math.floor((new Date() - new Date(birthday).getTime()) / 3.15576e+10);
				profile.age = getAge(profile.birthday);
				profile.city = locations[iLocation];
				profile.coordinates = coordinates[iLocation++];
				profile.password = bcrypt.hashSync('Malibu11', 10);
				profile.gender = profile.gender.toLowerCase();
				profile.bio = `I am ${profile.firstName} ${profile.lastName} and I am ${profile.age} years old. I am a ${preferences[iPreferences]}. I am from ${profile.city} and I am looking for a partner in ${profile.city}.`;
				const path = `../utils/profilePics/`;
				if (profile.gender === 'male'){
					profile.profilePicture = menPics[iMalePictures++];
					profile.picture = menPics[iMalePictures];
				} else{
					profile.profilePicture = womenPics[iFemalePictures++]; 
					profile.picture = womenPics[iFemalePictures];
				}
				profile.preferences = preferences[iPreferences++];
		
				let array = []; 
				let t = Math.floor(Math.random() * tags.length - 12);
				array.push(tags[t + 1]);
				array.push(tags[t + 3]);
				array.push(tags[t + 2]);
				array.push(tags[t + 6]);
				array.push(tags[t + 8]);
				array.push(tags[t + 9]);
				array.push(tags[t + 12]);
				const myJSON = JSON.stringify(array);
		
				const score = Math.floor(Math.random() * (50 - 10 + 1) + 10);

				const insertUsers = `INSERT INTO users (name, lastName, username, email, password, gender, bio, birthday, preference, acti_stat, interests, score)
									VALUES ('${profile.firstName}', '${profile.lastName}', '${profile.fullName}', '${profile.email}', '${profile.password}', '${profile.gender}', '${profile.bio}', '${profile.birthday}', '${profile.preferences}', 2, '${myJSON}', ${score});`;
				insertUsersArray.push(insertUsers);
			
				const insertPictures = `INSERT INTO user_pictures (user_id, pic_1, pic_2) VALUES (${i}, '${profile.profilePicture}', '${profile.picture}');`;
				insertPicturesArray.push(insertPictures);
		
				const lat = profile.coordinates.split(" ")[0];
				const lon = profile.coordinates.split(" ")[1];
				const insertLocation = `INSERT INTO locations (user_id, user_set_city, user_set_location) VALUES (${i}, '${profile.city}', POINT(${lon}, ${lat}));`;
				insertLocationArray.push(insertLocation);
		
				i++;

			}
		
			insertUsersArray.forEach((query) => {
				db.query(query, (err, result) => {
					if (err) throw err;
				})
			})
			insertPicturesArray.forEach((query) => {
				db.query(query, (err, result) => { 
					if (err) throw err;
				})
			})
			insertLocationArray.forEach((query) => {
				db.query(query, (err, result) => {
					if (err) throw err;
				})
			})
		}
	})
	
})
	
});

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
});

module.exports = db;