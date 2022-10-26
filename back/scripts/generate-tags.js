const db = require('../config/db');

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
'Theatre'
];
db.connect((err) => {
    if (err) throw err;
tags.forEach((tag) => {
  db.query(`INSERT INTO tags (tag) VALUES (${tag})`, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
});
});
