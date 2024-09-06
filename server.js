const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;





const db = mysql.createPool({
 host: 'localhost',
  user: 'xdbfuflb_tajheezUser',
  password: 'brma@hima',
  database: 'tajheez',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  }
});
const upload = multer({ storage });


app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register endpoint
app.post('/register', async (req, res) => {
  const { email, password, name, phone_number, country, firebase_UID } = req.body;
  
  // Access header variable
  const customHeader = req.headers['x-custom-header'];

//   if (!email || !password || !name || !country || !firebase_UID) {
//     return res.status(400).json({
//       'query': -1,
//       message: 'Missing required fields'
//     });
//   }

  try {
    // Example use of header variable
    if (customHeader !== 'expected-value') {
      return res.status(403).json({
        'query': -1,
        message: 'Invalid header value'
      });
    }

    // Check if email is already registered
    const [existingUser] = await db.promise().query(`SELECT * FROM Users WHERE email = ?`, [email]);

    if (existingUser.length > 0) {
      return res.status(201).json({
        'query': 1,
      'user': existingUser[0]
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const query = `INSERT INTO Users (email, password, name, phone_number, country, firebase_UID) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.promise().query(query, [email, hashedPassword, name, phone_number, country, firebase_UID]);

    // Fetch the newly created user
    const [newUser] = await db.promise().query(`SELECT *FROM Users WHERE user_id = ?`, [result.insertId]);

    res.status(201).json({
      'query': 1,
      'user': newUser[0] // Return the user data
    });
  } catch (error) {
    res.status(500).json({
      'query': -1,
      message: 'Server error',
      error
    });
  }
});


// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  

  if (!email || !password) {
    return res.status(400).json({'query': -1, message: 'Missing required fields' });
  }
  

  try {
    // Check if user exists
    const [results] = await db.promise().query(`SELECT * FROM Users WHERE email = ?`, [email]);

    if (results.length === 0) {
      return res.status(401).json({ 'query': -1,message: 'Invalid email or password' });
    }

    const user = results[0];
    
    // Compare passwords
    const match = await bcrypt.compare(password, user.password);

    // if (!match) {
    //   return res.status(401).json({'query': -1, message: 'Invalid email or password' });
    // }

  

    res.status(200).json({
            'query': 1,
            'user':results[0]
        });
  } catch (error) {
    // Properly handle errors
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }

});

// Update user information
app.put('/users/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  const { email, phone_number, name, country } = req.body;

  try {
    const sql = `
      UPDATE Users 
      SET 
        email = ?, 
        phone_number = ?,
        name = ?,
        country = ?
      WHERE 
        user_id = ?
    `;

    const [result] = await  db.promise().query(sql, [
      email, 
      phone_number, 
      name, 
      country, 
      user_id
    ]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found.' });
    } else {
       // Fetch the updated user data
    const selectSql = 'SELECT * FROM Users WHERE user_id = ?';
    const [userRows] = await db.promise().query(selectSql, [user_id]);

    res.json({ message: 'User updated successfully.', user: userRows[0] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user
app.delete('/users/:user_id', async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const sql = 'DELETE FROM Users WHERE user_id = ?';
    const [result] = await db.promise().query(sql, [user_id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found.' });
    } else {
      res.json({ message: 'User deleted successfully.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/adss', upload.array('images', 5), async (req, res) => {
  const connection = await db.promise().getConnection();
  await connection.beginTransaction();

  try {
    // Extract data from req.body and req.files
    const {
      user_id,
      category_id,
      title,
      description,
      price,
      product_status,
      offer_type,
      shipping_delivery_options,
      post_type,
      status,
      attribute_values, // Assuming this is a list of JSON objects
        contact_options,   // Assuming this is passed as JSON
      country  // Default country if not provided
    } = req.body;
    const images = req.files.map(file => file.path); // Store image paths

    const creation_date = new Date(); // Current time as creation_date
    const expiration_date = new Date();
    expiration_date.setDate(expiration_date.getDate() + 30); // Set expiration_date to 30 days in the future

    // Insert the ad into the Ads table
    const sqlAd = `INSERT INTO Ads (user_id, category_id, title, description, price, product_status, offer_type, shipping_delivery_options, images, post_type, status, creation_date, expiration_date, country, contact_options) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [adResult] = await connection.query(sqlAd, [
      user_id,
      category_id,
      title,
      description,
      price,
      product_status,
      offer_type,
      shipping_delivery_options,
      JSON.stringify(images),
      post_type,
      status,
      creation_date,
      expiration_date,
       country,
      JSON.stringify(contact_options)
 ]);
    const ad_id = adResult.insertId; // Get the inserted ad's ID
    
    
    // Confirm attribute_values is an array
    console.log('Is attribute_values an array?', Array.isArray(attribute_values));
    console.log('Attribute values:', attribute_values);

    // Convert attribute_values from string if necessary (for example, if it was received as a JSON string)
    let parsedAttributeValues = attribute_values;
    if (typeof attribute_values === 'string') {
      try {
        parsedAttributeValues = JSON.parse(attribute_values);
      } catch (e) {
        throw new Error('Failed to parse attribute_values JSON');
      }
    }

    // Ensure it's an array after parsing
    if (Array.isArray(parsedAttributeValues) && parsedAttributeValues.length > 0) {
      const isValid = parsedAttributeValues.every(attr => attr.attribute_id && attr.value);
      if (isValid) {
        const sqlAttributeValues = `INSERT INTO AttributeValues (ad_id, attribute_id, value) VALUES ?`;

        // Prepare the data for bulk insert
        const attributeValueData = parsedAttributeValues.map(attr => [
          ad_id,    // Associate with the newly created ad
          attr.attribute_id, // Extract attribute_id from the JSON object
          attr.value         // Extract value from the JSON object
        ]);

        await connection.query(sqlAttributeValues, [attributeValueData]);
      } else {
        throw new Error("Invalid attribute values format: Each attribute must have attribute_id and value.");
      }
    } else {
      console.error('attribute_values is not a valid array or is empty:', parsedAttributeValues);
    }

    // Commit the transaction
    await connection.commit();

    res.status(201).json({ id: ad_id, message: attribute_values });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});


app.post('/ads', upload.array('images', 5), async (req, res) => {
  try {
    // Extract data from req.body and req.files
    const { user_id, category_id, title, description, price, product_status, offer_type, shipping_delivery_options, post_type, status } = req.body;
    const images = req.files.map(file => file.path); // Store image paths

    const creation_date = new Date(); // Current time as creation_date
    const expiration_date = new Date();
    expiration_date.setDate(expiration_date.getDate() + 30); // Set expiration_date to 30 days in the future

    const sql = `INSERT INTO Ads (user_id, category_id, title, description, price, product_status, offer_type, shipping_delivery_options, images, post_type, status, creation_date, expiration_date, country, contact_options) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.promise().query(sql, [user_id, category_id, title, description, price, product_status, offer_type, shipping_delivery_options, JSON.stringify(images), post_type, status, creation_date, expiration_date, 'egypt', JSON.stringify(["phone", "email"])
    ]);

    res.status(201).json({ id: result.insertId, message: 'Ad created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/ads', async (req, res) => {
  try {
    const sql = 'SELECT * FROM Ads';
    const [rows] = await db.promise().query(sql);

    // Parse the images JSON field
    const adsWithParsedImages = rows.map(ad => {
      return {
        ...ad,
       images: JSON.parse(ad.images).map(image => `https://tanwer.net/${image}`)
       
       // Assuming images is stored as a JSON string
      };
    });

    res.status(200).json(adsWithParsedImages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/ads/search', async (req, res) => {
  const { title } = req.query;

  try {
    let sql = `
      SELECT 
        ad_id, user_id, category_id, title, description, price, product_status, offer_type, shipping_delivery_options, images, post_type, status, creation_date, expiration_date, country, contact_options
      FROM 
        Ads 
      WHERE 
        title LIKE ?
    `;
    
    const params = [`%${title}%`];

    const [rows] = await db.promise().query(sql, params);

    if (rows.length === 0) {
      res.status(404).json({ message: 'No ads found matching the title.', count: 0 });
    } else {
      // Parse the images JSON field and add domain URL
      const adsWithParsedImages = rows.map(ad => {
        return {
          ...ad,
          images: JSON.parse(ad.images).map(image => `https://tanwer.net/${image}`) // Adjust domain as needed
        };
      });

      res.json({ count: adsWithParsedImages.length, ads: adsWithParsedImages });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.get('/ads/:id', async (req, res) => {
  try {
    const adId = req.params.id; // Get the ad ID from the URL parameters

    // SQL query to get the ad details along with its attributes and the username of the ad's owner
    const sql = `
      SELECT 
        Ads.*,
        Users.name AS user_name,
        Attributes.attribute_id,
        Attributes.name AS attribute_name,
        Attributes.type AS attribute_type,
        AttributeValues.value
      FROM Ads
      LEFT JOIN Users ON Ads.user_id = Users.user_id
      LEFT JOIN AttributeValues ON Ads.ad_id = AttributeValues.ad_id
      LEFT JOIN Attributes ON AttributeValues.attribute_id = Attributes.attribute_id
      WHERE Ads.ad_id = ?
    `;

    const [rows] = await db.promise().query(sql, [adId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    // Parse the images JSON field and prepend the domain to each image path
    const ad = {
      ...rows[0],
      images: JSON.parse(rows[0].images).map(image => `https://tanwer.net/${image}`),
      contact_options: JSON.parse(rows[0].contact_options), // Parse the contact_options JSON string
      user_name: rows[0].user_name,
      attributes: []
    };

    // Collect attributes from the rows
    rows.forEach(row => {
      if (row.attribute_id) {
        ad.attributes.push({
          attribute_id: row.attribute_id,
          name: row.attribute_name,
          type: row.attribute_type,
          value: row.value
        });
      }
    });
    
     // Check if there are no attributes
    if (ad.attributes.length === 0) {
      ad.attributes = null; // or leave it as an empty array if you prefer
    }
    

    // Send the ad along with its attributes and user name as a JSON response
    res.status(200).json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/adswithint/:id/:user_id', async (req, res) => {
  try {
    const adId = req.params.id; // Get the ad ID from the URL parameters
    const userId = req.params.user_id; // Get the user ID from the URL parameters

    // SQL query to get the ad details along with its attributes, username of the ad's owner, and interactions
    const sql = `
      SELECT 
        Ads.*,
        TRIM(Users.user_id) AS user_id, -- Trim the user_id to remove extra whitespace or line breaks
        TRIM(Users.name) AS user_name,
        Attributes.attribute_id,
        Attributes.name AS attribute_name,
        Attributes.type AS attribute_type,
        AttributeValues.value,
        MAX(CASE WHEN Interactions.type = 'like' THEN 1 ELSE 0 END) AS is_liked,
        MAX(CASE WHEN Interactions.type = 'favorite' THEN 1 ELSE 0 END) AS is_favorite
      FROM Ads
      LEFT JOIN Users ON Ads.user_id = Users.user_id
      LEFT JOIN AttributeValues ON Ads.ad_id = AttributeValues.ad_id
      LEFT JOIN Attributes ON AttributeValues.attribute_id = Attributes.attribute_id
      LEFT JOIN Interactions ON Ads.ad_id = Interactions.ad_id AND Interactions.user_id = ?
      WHERE Ads.ad_id = ?
      GROUP BY Ads.ad_id, Users.user_id, Users.name, Attributes.attribute_id, Attributes.name, Attributes.type, AttributeValues.value
    `;

    const [rows] = await db.promise().query(sql, [userId, adId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    // Parse the images JSON field and prepend the domain to each image path
    const ad = {
      ...rows[0],
      user_id: rows[0].user_id ? rows[0].user_id.trim() : null,  // Check for null before trimming
      images: JSON.parse(rows[0].images).map(image => `https://tanwer.net/${image}`),
      contact_options: JSON.parse(rows[0].contact_options), // Parse the contact_options JSON string
      user_name: rows[0].user_name ? rows[0].user_name.trim() : null,  // Check for null before trimming
      attributes: [],
      is_liked: rows[0].is_liked === 1,
      is_favorite: rows[0].is_favorite === 1
    };

    // Collect attributes from the rows
    rows.forEach(row => {
      if (row.attribute_id) {
        ad.attributes.push({
          attribute_id: row.attribute_id,
          name: row.attribute_name,
          type: row.attribute_type,
          value: row.value
        });
      }
    });

    // Check if there are no attributes
    if (ad.attributes.length === 0) {
      ad.attributes = null; // or leave it as an empty array if you prefer
    }

    // Send the ad along with its attributes, user name, and interaction status as a JSON response
    res.status(200).json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/adst/:id/:user_id', async (req, res) => {
  try {
    const adId = parseInt(req.params.id);  // Parse ad ID as an integer
    const userId = req.params.user_id;
    const language = req.query.lang || 'en';  // Default to 'en' if no language is specified

    const sql = `
      SELECT 
        Ads.ad_id,
        Ads.user_id AS ad_user_id,
        TRIM(Users.name) AS user_name,
        Ads.title AS default_title,
        Ads.description AS default_description,
        Ads.product_status AS default_product_status,
        Ads.offer_type AS default_offer_type,
        Ads.shipping_delivery_options AS default_shipping_options,
        Ads.images,
        Ads.contact_options,
        Ads.creation_date,
        Ads.expiration_date,
        Ads.status,
        AdTranslations.title,
        AdTranslations.description,
        AdTranslations.product_status,
        AdTranslations.offer_type,
        AdTranslations.shipping_delivery_options,
        Attributes.attribute_id,
        Attributes.name AS attribute_name,
        Attributes.type AS attribute_type,
        AttributeValues.value,
        MAX(CASE WHEN Interactions.type = 'like' THEN 1 ELSE 0 END) AS is_liked,
        MAX(CASE WHEN Interactions.type = 'favorite' THEN 1 ELSE 0 END) AS is_favorite
      FROM Ads
      LEFT JOIN Users ON Ads.user_id = Users.user_id
      LEFT JOIN AdTranslations ON Ads.ad_id = AdTranslations.ad_id AND AdTranslations.language_code = ?
      LEFT JOIN AttributeValues ON Ads.ad_id = AttributeValues.ad_id
      LEFT JOIN Attributes ON AttributeValues.attribute_id = Attributes.attribute_id
      LEFT JOIN Interactions ON Ads.ad_id = Interactions.ad_id AND Interactions.user_id = ?
      WHERE Ads.ad_id = ?
      GROUP BY Ads.ad_id, Users.user_id, Users.name, Attributes.attribute_id, Attributes.name, Attributes.type, AttributeValues.value, AdTranslations.title, AdTranslations.description, AdTranslations.product_status, AdTranslations.offer_type, AdTranslations.shipping_delivery_options
    `;

    const [rows] = await db.promise().query(sql, [language, userId, adId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    // Prepare the ad object with fallbacks to English content
    const ad = {
      ad_id: rows[0].ad_id,
      user_id: rows[0].ad_user_id ? rows[0].ad_user_id.trim() : null,
      user_name: rows[0].user_name,
      images: [],
      contact_options: rows[0].contact_options ? JSON.parse(rows[0].contact_options) : null,
      creation_date: rows[0].creation_date,
      expiration_date: rows[0].expiration_date,
      status: rows[0].status,
      title: rows[0].title || rows[0].default_title,
      description: rows[0].description || rows[0].default_description,
      product_status: rows[0].product_status || rows[0].default_product_status,
      offer_type: rows[0].offer_type || rows[0].default_offer_type,
      shipping_delivery_options: rows[0].shipping_delivery_options || rows[0].default_shipping_options,
      attributes: [],
      is_liked: rows[0].is_liked === 1,
      is_favorite: rows[0].is_favorite === 1
    };

    // Parse and prepend domain to images
    if (rows[0].images) {
      try {
        ad.images = JSON.parse(rows[0].images).map(image => `https://tanwer.net/${image}`);
      } catch (e) {
        console.error("Error parsing images:", e);
        ad.images = [];
      }
    }

    // Collect attributes
    rows.forEach(row => {
      if (row.attribute_id) {
        ad.attributes.push({
          attribute_id: row.attribute_id,
          name: row.attribute_name,
          type: row.attribute_type,
          value: row.value
        });
      }
    });

    // Send the response
    res.status(200).json(ad);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 
app.get('/categories-with-attributes', async (req, res) => {
  try {
    const language = req.query.lang || 'en'; // Default to English if no language is specified

    const sql = `
      SELECT 
        c.category_id, 
        COALESCE(ct.translated_name, c.name) AS category_name, -- Use translated category name if available
        c.description AS category_description,
        c.image AS category_image,
        a.attribute_id, 
        COALESCE(at.translated_name, a.name) AS attribute_name, -- Use translated attribute name if available
        a.type AS attribute_type,
        a.validation_rules
      FROM 
        Categories c
      LEFT JOIN 
        CategoryTranslations ct ON c.category_id = ct.category_id AND (ct.language_code = ? OR ct.language_code = 'en')
      LEFT JOIN 
        Attributes a ON JSON_CONTAINS(a.categories, JSON_QUOTE(c.category_id), '$')
      LEFT JOIN 
        AttributeTranslations at ON a.attribute_id = at.attribute_id AND (at.language_code = ? OR at.language_code = 'en')
      ORDER BY 
        c.category_id;
    `;

    const [rows] = await db.promise().query(sql, [language, language]);
    
    // Grouping results by category
    const categories = {};
    rows.forEach(row => {
      if (!categories[row.category_id]) {
        categories[row.category_id] = {
          category_id: String(row.category_id),
          name: row.category_name,
          description: row.category_description,
          image: `https://tanwer.net${row.category_image}`,
          attributes: []
        };
      }
      if (row.attribute_id) {
        categories[row.category_id].attributes.push({
          attribute_id: row.attribute_id,
          name: row.attribute_name,
          type: row.attribute_type,
          validation_rules: row.validation_rules
        });
      }
    });

    res.json(Object.values(categories));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attributes by category ID
app.get('/attributes/:categoryid', async (req, res) => {
  const { categoryid } = req.params;

  try {
    const sql = `
      SELECT 
        a.attribute_id, 
        a.name AS attribute_name, 
        a.type AS attribute_type,
        JSON_UNQUOTE(a.validation_rules) AS validation_rules
      FROM 
        Attributes a
      WHERE 
        JSON_CONTAINS(a.categories, JSON_QUOTE(?), '$')
    `;

    const [rows] = await db.promise().query(sql, [categoryid]);

    // Parse validation_rules from a string to JSON
    const result = rows.map(row => ({
      ...row,
      validation_rules: JSON.parse(row.validation_rules)
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching attributes' });
  }
});


app.get('/categories/homepage-with-ads', async (req, res) => {
  try {
    const domain = 'https://tanwer.net'; // Define the domain to prepend
    const language = req.query.lang || 'en'; // Default to English if no language is specified

    const sql = `
      SELECT 
          c.category_id, 
          COALESCE(
            (SELECT ct.translated_name FROM CategoryTranslations ct 
             WHERE ct.category_id = c.category_id AND ct.language_code = ? LIMIT 1), 
            c.name
          ) AS category_name, -- Use translated category name if available, otherwise fallback to English
          c.description AS category_description, 
          c.parent_category_id, 
          c.image AS category_image,
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'ad_id', a.ad_id,
                  'title', COALESCE(
                    (SELECT at.title FROM AdTranslations at 
                     WHERE at.ad_id = a.ad_id AND at.language_code = ? LIMIT 1), 
                    a.title
                  ), -- Use translated ad title if available, otherwise fallback to English
                  'description', a.description,
                  'price', a.price,
                  'product_status', a.product_status,
                  'offer_type', a.offer_type,
                  'shipping_delivery_options', a.shipping_delivery_options,
                  'images', a.images,  
                  'post_type', a.post_type,
                  'status', a.status,
                  'creation_date', a.creation_date,
                  'expiration_date', a.expiration_date,
                  'country', a.country,
                  'contact_options', a.contact_options
              )
          ) AS ads
      FROM 
          Categories c
      JOIN 
          Ads a ON c.category_id = a.category_id
      WHERE 
          c.homepage = TRUE
      GROUP BY 
          c.category_id, c.name, c.description, c.parent_category_id, c.image
      HAVING 
          COUNT(a.ad_id) > 0;
    `;

    const [rows] = await db.promise().query(sql, [language, language]);

    // Debugging: Log the raw data
    console.log('Raw data from database:', rows);

    // Prepend domain to the image URLs and parse ads JSON
    const categoriesWithUpdatedImages = rows.map(category => {
      let ads;
      try {
        ads = JSON.parse(category.ads); // Parse ads JSON
      } catch (e) {
        console.error('Error parsing ads JSON:', category.ads, e);
        ads = [];
      }

      // Update the image URLs for each ad
      const updatedAds = ads.map(ad => ({
        ...ad,
        images: ad.images.map(image => `${domain}/${image}`) // Prepend domain to each image URL
      }));

      return {
        ...category,
        ads: updatedAds
      };
    });

    if (categoriesWithUpdatedImages.length === 0) {
      res.status(404).json({ message: 'No categories with ads found for homepage.' });
    } else {
      res.status(200).json(categoriesWithUpdatedImages);
    }
  } catch (err) {
    console.error('Error fetching categories with ads:', err); // Detailed error logging
    res.status(500).json({ error: 'An error occurred while fetching categories with ads.', details: err.message });
  }
});



// API endpoint to get categories with subcategories
app.get('/categories-with-subcategories', async (req, res) => {
  try {
    const language = req.query.lang || 'en'; // Default to English if no language is specified

    const sql = `
      SELECT 
          c1.category_id AS CategoryID,
          COALESCE(ct1.translated_name, c1.name) AS CategoryName, -- Fallback to default name if translation is not available
          c1.description AS CategoryDescription,
          c1.image AS CategoryImage,
          c2.category_id AS SubCategoryID,
          COALESCE(ct2.translated_name, c2.name) AS SubCategoryName, -- Fallback to default subcategory name if translation is not available
          c2.description AS SubCategoryDescription
      FROM 
          Categories c1
      LEFT JOIN 
          Categories c2 ON c1.category_id = c2.parent_category_id
      LEFT JOIN 
          CategoryTranslations ct1 ON c1.category_id = ct1.category_id AND (ct1.language_code = ? OR ct1.language_code = 'en')
      LEFT JOIN 
          CategoryTranslations ct2 ON c2.category_id = ct2.category_id AND (ct2.language_code = ? OR ct2.language_code = 'en')
      WHERE 
          (ct1.language_code = ? OR ct1.language_code IS NULL) 
      AND 
          (ct2.language_code = ? OR ct2.language_code IS NULL)
      ORDER BY 
          c1.category_id, c2.category_id;
    `;
    
    const [rows] = await db.promise().query(sql, [language, language, language, language]);

    // Process the result to nest subcategories under their parent categories
    const categories = {};

    rows.forEach(row => {
      const { CategoryID, CategoryName, CategoryDescription, CategoryImage, SubCategoryID, SubCategoryName, SubCategoryDescription } = row;

      if (!categories[CategoryID]) {
        categories[CategoryID] = {
          category_id: CategoryID,
          name: CategoryName,
          description: CategoryDescription,
          image: `https://tanwer.net${CategoryImage}`,
          subcategories: []
        };
      }

      if (SubCategoryID) {
        categories[CategoryID].subcategories.push({
          category_id: SubCategoryID,
          name: SubCategoryName,
          description: SubCategoryDescription
        });
      }
    });

    // Convert the categories object into an array
    const result = Object.values(categories);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/ads/category/:category_id', async (req, res) => {
  const category_id = req.params.category_id;

  try {
    const sql = `
      SELECT 
        ad_id, user_id, category_id, title, description, price, product_status, offer_type, shipping_delivery_options, images, post_type, status, creation_date, expiration_date, country, contact_options
      FROM 
        Ads 
      WHERE 
        category_id = ?;
    `;

    const [rows] = await db.promise().query(sql, [category_id]);

    if (rows.length === 0) {
      res.status(404).json({ message: 'No ads found for this category.' });
    } else {
      // Parse the images JSON field and add domain URL
      const adsWithParsedImages = rows.map(ad => {
        return {
          ...ad,
          images: JSON.parse(ad.images).map(image => `https://tanwer.net/${image}`) // Adjust domain as needed
        };
      });

      res.json(adsWithParsedImages);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); 



app.get('/messages/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT 
        m1.message_id,
        m1.content,
        m1.timestamp,
        Ads.ad_id,
        Ads.title AS ad_name,
        Sender.user_id AS sender_id,
        Sender.name AS sender_name,
        Sender.email AS sender_email,
        Receiver.user_id AS receiver_id,
        Receiver.name AS receiver_name,
        Receiver.email AS receiver_email
    FROM 
        Messages m1
    JOIN 
        Ads ON m1.ad_id = Ads.ad_id
    JOIN 
        Users AS Sender ON m1.sender_id = Sender.user_id
    JOIN 
        Users AS Receiver ON m1.receiver_id = Receiver.user_id
    WHERE 
        (m1.sender_id = ? OR m1.receiver_id = ?)
        AND m1.timestamp = (
            SELECT MAX(m2.timestamp)
            FROM Messages m2
            WHERE m2.ad_id = m1.ad_id
            AND (m2.sender_id = ? OR m2.receiver_id = ?)
        )
    ORDER BY 
        m1.timestamp DESC;
  `;

  try {
    const [rows] = await db.promise().query(sql, [user_id, user_id, user_id, user_id]);

    // Format the timestamp
    const formattedRows = rows.map(row => {
      const timestamp = new Date(row.timestamp);
      const date = timestamp.toLocaleDateString('en-GB'); // Format as "DD/MM/YYYY"
      const time = timestamp.toTimeString().split(' ')[0]; // Extract "HH:MM:SS"
      const formattedDateTime = `${date} ${time}`; // Combine date and time
      return { ...row, formattedDateTime };
    });

    res.json(formattedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/conversations/:ad_id/:user1_id/:user2_id', async (req, res) => {
  const { ad_id, user1_id, user2_id } = req.params;

  try {
    // Get the ad owner's user ID
    const [adResult] = await db.promise().query('SELECT user_id FROM Ads WHERE ad_id = ?', [ad_id]);
    if (adResult.length === 0) {
      return res.status(404).json({ error: 'Ad not found' });
    }
    const adOwnerId = adResult[0].user_id;

    // Determine which user is the ad owner and which one is the other user
    let sender_id, receiver_id;
    
    if (user1_id == adOwnerId) {
      sender_id = user1_id;
      receiver_id = user2_id;
    } else if (user2_id == adOwnerId) {
      sender_id = user2_id;
      receiver_id = user1_id;
    } else {
      sender_id = user1_id;
      receiver_id = user2_id;
    }

    // Get messages where either user is the sender/receiver
    const sql = `
      SELECT 
          Messages.message_id,
          Messages.content,
          Messages.timestamp,
          Ads.ad_id,
          Ads.title AS ad_name,
          Sender.user_id AS sender_id,
          Sender.name AS sender_name,
          Sender.email AS sender_email,
          Receiver.user_id AS receiver_id,
          Receiver.name AS receiver_name,
          Receiver.email AS receiver_email
      FROM 
          Messages
      JOIN 
          Ads ON Messages.ad_id = Ads.ad_id
      JOIN 
          Users AS Sender ON Messages.sender_id = Sender.user_id
      JOIN 
          Users AS Receiver ON Messages.receiver_id = Receiver.user_id
      WHERE 
          Messages.ad_id = ? 
          AND (
              (Messages.sender_id = ? AND Messages.receiver_id = ?)
              OR 
              (Messages.sender_id = ? AND Messages.receiver_id = ?)
          )
      ORDER BY 
          Messages.timestamp DESC;
    `;

    const [rows] = await db.promise().query(sql, [
      ad_id, sender_id, receiver_id, receiver_id, sender_id
    ]);

    // Format the timestamp
    const formattedRows = rows.map(row => {
      const timestamp = new Date(row.timestamp);
      const date = timestamp.toLocaleDateString('en-GB'); // Format as "DD/MM/YYYY"
      const time = timestamp.toTimeString().split(' ')[0]; // Extract "HH:MM:SS"
      const formattedDateTime = `${date} ${time}`; // Combine date and time
      return { ...row, formattedDateTime };
    });

    res.json(formattedRows);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: 'An error occurred while fetching conversations' });
  }
});

app.post('/messages', async (req, res) => {
  const { ad_id, sender_id, receiver_id, content } = req.body;

  // Basic validation
  if (!ad_id || !sender_id || !receiver_id || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const timestamp = new Date(); // Current timestamp

    // Insert the new message
    const sqlInsert = `INSERT INTO Messages (ad_id, sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.promise().query(sqlInsert, [ad_id, sender_id, receiver_id, content, timestamp]);

    // Retrieve all messages between these two users for this ad
    const sqlSelect = `
      SELECT 
          Messages.message_id,
          Messages.content,
          Messages.timestamp,
          Ads.ad_id,
          Ads.title AS ad_name,
          Sender.user_id AS sender_id,
          Sender.name AS sender_name,
          Sender.email AS sender_email,
          Receiver.user_id AS receiver_id,
          Receiver.name AS receiver_name,
          Receiver.email AS receiver_email
      FROM 
          Messages
      JOIN 
          Ads ON Messages.ad_id = Ads.ad_id
      JOIN 
          Users AS Sender ON Messages.sender_id = Sender.user_id
      JOIN 
          Users AS Receiver ON Messages.receiver_id = Receiver.user_id
      WHERE 
          Messages.ad_id = ? 
          AND (
              (Messages.sender_id = ? AND Messages.receiver_id = ?)
              OR 
              (Messages.sender_id = ? AND Messages.receiver_id = ?)
          )
      ORDER BY 
          Messages.timestamp DESC;
    `;

    const [rows] = await db.promise().query(sqlSelect, [
      ad_id, sender_id, receiver_id, receiver_id, sender_id
    ]);

    // Format the timestamp
    const formattedRows = rows.map(row => {
      const timestamp = new Date(row.timestamp);
      const date = timestamp.toLocaleDateString('en-GB'); // Format as "DD/MM/YYYY"
      const time = timestamp.toTimeString().split(' ')[0]; // Extract "HH:MM:SS"
      const formattedDateTime = `${date} ${time}`; // Combine date and time

      return { ...row, formattedDateTime };
    });

    // Respond with the full list of messages including the newly inserted message
    res.status(201).json({
      message: 'Message sent successfully',
      message_id: result.insertId,
      all_messages: formattedRows
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to send message' });
  }
});


app.get('/tokenpackages', async (req, res) => {
  try {
    const sql = `
      SELECT * FROM TokenPackage;
    `;
    
    const [rows] = await db.promise().query(sql);

    // Group packages by token_type
    const groupedPackages = rows.reduce((acc, row) => {
      if (!acc[row.token_type]) {
        acc[row.token_type] = [];
      }
      acc[row.token_type].push({
        package_id: row.package_id,
        package_name: row.package_name,
        price: row.price
      });
      return acc;
    }, {});

    // Initialize the response object with empty objects for standard and featured
    const response = {
      standard: groupedPackages['standard'] || {},
      featured: groupedPackages['featured'] || {}
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/interactions', async (req, res) => {
  const { ad_id, user_id, type } = req.body;

  try {
    const sql = `
      INSERT INTO Interactions (ad_id, user_id, type, timestamp)
      SELECT ?, ?, ?, NOW() FROM DUAL
      WHERE NOT EXISTS (
        SELECT 1 FROM Interactions WHERE ad_id = ? AND user_id = ? AND type = ?
      )
    `;

    const [result] = await db.promise().query(sql, [ad_id, user_id, type, ad_id, user_id, type]);

    if (result.affectedRows === 0) {
      res.status(409).json({ message: 'Interaction already exists' });
    } else {
      res.status(201).json({
        message: 'Interaction added successfully'
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/interactions/favorites/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const sql = `
      SELECT 
        i.ad_id, 
        a.title AS ad_title, 
        a.description AS ad_description, 
        a.price AS ad_price, 
        a.product_status AS ad_product_status, 
        a.offer_type AS ad_offer_type, 
        a.shipping_delivery_options AS ad_shipping_delivery_options, 
        a.images AS ad_images, 
        a.post_type AS ad_post_type, 
        a.status AS ad_status, 
        a.creation_date AS ad_creation_date, 
        a.expiration_date AS ad_expiration_date, 
        a.country AS ad_country, 
        a.contact_options AS ad_contact_options, 
        i.type AS interaction_type, 
        i.timestamp AS interaction_timestamp
      FROM Interactions i
      JOIN Ads a ON i.ad_id = a.ad_id
      WHERE i.user_id = ? AND i.type = 'favorite'
    `;

    const [rows] = await db.promise().query(sql, [user_id]);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
