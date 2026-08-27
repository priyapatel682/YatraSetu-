const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploads statically

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
}

// Multer Setup for Image Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary Setup
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'vusd4idx', 
  api_key: process.env.CLOUDINARY_API_KEY || '148688538784341', 
  api_secret: process.env.CLOUDINARY_API_SECRET // User must provide this in .env or Render
});

// Cloudinary Upload Helper
const uploadToCloudinary = (buffer, folder = 'yatrasetu') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

// In-Memory Fallback Database
let isMongoConnected = false;
let mockTemples = [
  {
    _id: "t1",
    name: "Kashi Vishwanath",
    location: "Varanasi, Uttar Pradesh",
    state: "Uttar Pradesh",
    deity: "Shiva",
    description: "The Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh, India. The temple stands on the western bank of the holy river Ganga, and is one of the twelve Jyotirlingas, the holiest of Shiva temples.\n\nThe main deity is known by the name Vishwanath or Vishweshwara meaning Ruler of the Universe. Varanasi city is also called Kashi, and hence the temple is popularly called Kashi Vishwanath Temple. The temple has been referred to in Hindu theology for a very long time and as a central part of worship in the Shaiva philosophy.",
    coverImage: "",
    images: [],
    lat: 25.3109,
    lng: 83.0107,
    rituals: ["Mangala Aarti: 3:00 AM - 4:00 AM", "Bhog Aarti: 11:15 AM - 12:20 PM", "Sandhya Aarti: 7:00 PM - 8:15 PM", "Shringar Aarti: 9:00 PM - 10:15 PM"],
    timings: ["4:00 AM - 11:00 AM", "12:00 PM - 7:00 PM"],
    facilities: { transport: "Well connected by road, rail (Varanasi Junction), and air (LBS Airport).", stay: "Numerous hotels, guesthouses, and dharamshalas available near the ghats." },
    guidelines: { dressCode: "Traditional Indian wear (Dhoti/Kurta for men, Saree/Suit for women)", otherRules: "Mobile phones, cameras, and leather items are strictly prohibited inside the temple premises." },
    status: "approved",
    isFeatured: true,
    isPopular: true,
    createdAt: new Date("2026-08-01T00:00:00Z")
  },
  {
    _id: "t2",
    name: "Badrinath Temple",
    location: "Badrinath, Uttarakhand",
    state: "Uttarakhand",
    deity: "Vishnu",
    description: "Badrinath or Badrinarayan Temple is a Hindu temple dedicated to Lord Vishnu which is situated in the town of Badrinath in Uttarakhand, India. The temple and town form one of the four Char Dham and Chota Char Dham pilgrimage sites.\n\nThe temple is located in Garhwal hill tracks in Chamoli district along the banks of Alaknanda River at an elevation of 3,133 m (10,279 ft) above the mean sea level. It is one of the most visited pilgrimage centers of India, drawing lakhs of devotees every year.",
    coverImage: "",
    images: [],
    lat: 30.7433,
    lng: 79.4938,
    rituals: ["Maha Abhishek: 4:30 AM", "Geeta Path: 6:30 AM", "Swarna Aarti: 6:30 PM", "Shayan Aarti: 8:30 PM"],
    timings: ["4:30 AM - 1:00 PM", "4:00 PM - 9:00 PM"],
    facilities: { transport: "Accessible by road from Haridwar and Rishikesh. Nearest airport is Jolly Grant, Dehradun.", stay: "GMVN tourist rest houses, ashrams, and private hotels available." },
    guidelines: { dressCode: "Modest and warm clothing due to cold weather.", otherRules: "Photography is prohibited inside the inner sanctum. Temple is open only for 6 months (May to November)." },
    status: "approved",
    isFeatured: true,
    isPopular: true,
    createdAt: new Date("2026-08-02T00:00:00Z")
  },
  {
    _id: "t3",
    name: "Meenakshi Amman",
    location: "Madurai, Tamil Nadu",
    state: "Tamil Nadu",
    deity: "Goddess Meenakshi (Parvati)",
    description: "Arulmigu Meenakshi Sundareshwarar Temple is a historic Hindu temple located on the southern bank of the Vaigai River in the temple city of Madurai, Tamil Nadu, India. It is dedicated to the goddess Meenakshi, a form of Parvati, and her consort, Sundareshwar, a form of Shiva.\n\nThe temple is at the center of the ancient temple city of Madurai mentioned in the Tamil Sangam literature, with the goddess temple mentioned in 6th century CE texts. The complex is known for its towering gopurams (gateway towers) which are covered in thousands of colorful stucco figures.",
    coverImage: "",
    images: [],
    lat: 9.9195,
    lng: 78.1193,
    rituals: ["Thiruvanandal Puja: 5:00 AM", "Uchikala Puja: 12:00 PM", "Sayarakshai Puja: 6:00 PM", "Palliarai Puja: 9:30 PM"],
    timings: ["5:00 AM - 12:30 PM", "4:00 PM - 10:00 PM"],
    facilities: { transport: "Madurai is well connected by air, rail, and road. The temple is in the heart of the city.", stay: "A wide range of accommodations from budget lodges to luxury hotels are available." },
    guidelines: { dressCode: "Strictly traditional. Men must wear dhoti or pants (no shorts). Women must wear saree or salwar kameez.", otherRules: "Mobile phones are not allowed inside. Deposit them at the entrance lockers." },
    status: "approved",
    isFeatured: true,
    isPopular: true,
    createdAt: new Date("2026-08-03T00:00:00Z")
  }
];
let mockPosts = [
  {
    _id: "1",
    id: "1",
    title: "The Architectural Marvel of Kailasanathar Temple",
    excerpt: "Carved out of a single rock, the Kailasanathar Temple in Ellora stands as a testament to the unparalleled craftsmanship of ancient Indian artisans. Explore its monolithic secrets...",
    content: "The Kailasanathar Temple, also known as the Kailasa Temple, is one of the largest rock-cut ancient Hindu temples located in Ellora, Maharashtra, India. A megalith carved out of one single rock, it is considered one of the most remarkable cave temples in the world because of its size, architecture, and sculptural treatment.\n\n### Historical Context\nCommissioned by the Rashtrakuta King Krishna I (756-773 CE), the temple was designed to recall Mount Kailash, the abode of Lord Shiva. It is a stunning display of Dravidian architecture, characterized by its towering vimana and intricately carved mandapa.\n\n### Monolithic Construction\nWhat makes Kailasa truly unique is the method of its construction. Unlike most temples which are built from the ground up, this marvel was excavated from the top down. An estimated 200,000 tons of rock were removed by generations of artisans using merely hammers and chisels. The precision required to plan and execute such a top-down excavation without modern engineering tools is baffling to this day.\n\n### Sculptural Brilliance\nThe temple is adorned with exquisite sculptures depicting scenes from the Ramayana, the Mahabharata, and various manifestations of Shiva and Vishnu. The base of the temple is carved with life-sized elephants, giving the illusion that they are holding up the entire mountain structure. \n\n### Preservation\nToday, it stands as Cave 16 among the 34 caves at Ellora. A UNESCO World Heritage Site, it remains an architectural pinnacle of ancient India, drawing scholars, pilgrims, and tourists from across the globe to marvel at its enduring beauty.",
    author: "Aditi Sharma",
    date: "August 20, 2026",
    readTime: "5 min read",
    category: "Architecture",
    imageColor: "bg-amber-100",
  },
  {
    _id: "2",
    id: "2",
    title: "Understanding the Rituals of Kashi Vishwanath",
    excerpt: "Varanasi's spiritual heart beats at the Kashi Vishwanath Temple. We dive deep into the daily Mangala Aarti and the profound symbolism behind the Jyotirlinga.",
    content: "Varanasi, one of the oldest living cities in the world, finds its spiritual core at the Kashi Vishwanath Temple. Dedicated to Lord Shiva, the deity here is revered as Vishwanath or Vishweshwara, meaning the Ruler of the Universe.\n\n### The Significance of the Jyotirlinga\nThe temple houses one of the twelve Jyotirlingas, which are considered the supreme, undivided reality out of which Shiva appeared. It is believed that a darshan (divine viewing) of this lingam brings instant liberation (Moksha) from the cycle of rebirth.\n\n### Mangala Aarti: The Awakening\nThe most sacred of all daily rituals here is the Mangala Aarti, performed every morning between 3:00 AM and 4:00 AM. Devotees gather in the pre-dawn darkness to witness the awakening of the Lord. The air resonates with Vedic chants, the ringing of bells, and the fragrance of sandalwood and incense. This deeply mystical ritual sets the spiritual rhythm for the entire city.\n\n### The Cycle of Rituals\nThroughout the day, various aartis and pujas are conducted:\n*   **Bhog Aarti (Midday):** The offering of food to the deity.\n*   **Sandhya Aarti (Evening):** A grand ritual at dusk.\n*   **Shringar Aarti (Night):** The dressing and adorning of the Shiva Linga.\n*   **Shayan Aarti (Bedtime):** The final ritual where the deity is laid to rest.\n\nUnderstanding these rituals offers a profound glimpse into the living, breathing faith that has sustained Kashi for millennia.",
    author: "Vikram Singh",
    date: "August 18, 2026",
    readTime: "8 min read",
    category: "Rituals",
    imageColor: "bg-blue-100",
  },
  {
    _id: "3",
    id: "3",
    title: "A Pilgrim's Guide to the Char Dham Yatra",
    excerpt: "Embarking on the Char Dham Yatra is a life-changing experience. Here is everything you need to know about preparing for the treacherous but rewarding journey to Yamunotri, Gangotri, Kedarnath, and Badrinath.",
    content: "The Char Dham Yatra is a spiritual pilgrimage circuit in the Indian Himalayas, covering four holy sites: Yamunotri, Gangotri, Kedarnath, and Badrinath. Undertaking this journey is considered highly auspicious and a means to wash away sins.\n\n### 1. Yamunotri: The Source of Yamuna\nThe yatra traditionally begins at Yamunotri in the west. Situated at an altitude of 3,293 meters, the temple is dedicated to Goddess Yamuna. Pilgrims often cook rice in the natural hot springs here as an offering (Prasad).\n\n### 2. Gangotri: The Descent of the Ganga\nNext is Gangotri, the spiritual source of the Ganges. The temple, made of white marble, sits on the banks of the Bhagirathi river. This site commemorates King Bhagirath's penance, which brought the holy river down to earth to cleanse the ashes of his ancestors.\n\n### 3. Kedarnath: The Abode of Shiva\nPerhaps the most arduous trek of the four, Kedarnath is dedicated to Lord Shiva and houses one of the twelve Jyotirlingas. Set against the majestic backdrop of the Kedar Dome peak at 3,583 meters, reaching this shrine is a profound test of endurance and faith.\n\n### 4. Badrinath: The Realm of Vishnu\nThe final stop is Badrinath, nestled between the Nar and Narayan mountain ranges. This vibrant, colorful temple is dedicated to Lord Vishnu and is one of the most visited pilgrimage sites in India. The Tapt Kund hot springs nearby offer a purifying dip before entering the temple.\n\n### Preparation Tips\n*   **Fitness:** The high altitudes require excellent physical stamina. Begin cardio exercises months in advance.\n*   **Timing:** The shrines are open only for six months (May to November). Check the opening dates, usually tied to Akshaya Tritiya.\n*   **Packing:** Layers are essential. Carry thermal wear, sturdy trekking shoes, basic medical supplies, and rain gear.",
    author: "Priya Patel",
    date: "August 15, 2026",
    readTime: "12 min read",
    category: "Travel Guide",
    imageColor: "bg-emerald-100",
  },
  {
    _id: "4",
    id: "4",
    title: "The Hidden Stepwells of Modhera Sun Temple",
    excerpt: "Beyond its stunning main shrine, the Modhera Sun Temple features the Surya Kund, an intricate stepwell with precisely geometric steps and miniature shrines. Let's uncover its history.",
    content: "Built in 1026 CE by King Bhima I of the Chaulukya dynasty, the Modhera Sun Temple in Gujarat is an architectural masterpiece dedicated to the solar deity, Surya. While the main shrine is awe-inspiring, the complex's stepwell, the Surya Kund, is equally captivating.\n\n### The Surya Kund\nAlso known as the Rama Kund, this massive rectangular stepwell served both practical and religious purposes. Pilgrims would perform ceremonial ablutions in its waters before entering the temple. \n\n### Geometric Precision\nThe true marvel of the Surya Kund is its geometric design. The steps descend in a mesmerizing, labyrinth-like pattern, creating an optical illusion of endless depth. The precise arrangement reflects the deep mathematical and astronomical knowledge of ancient Indian architects.\n\n### Miniature Shrines\nInterspersed along the terraces and steps are 108 miniature shrines, dedicated to various Hindu gods and goddesses, including Lord Vishnu, Lord Ganesha, and Shitala Mata. These shrines turn a functional water reservoir into a deeply sacred space.\n\n### Astronomical Alignment\nLike the main temple, which is designed so that the first rays of the sun at the equinox illuminate the idol, the stepwell is also perfectly aligned. During the equinoxes, the reflection of the sun in the water aligns perfectly with the main temple's entrance. The Modhera Sun Temple stands as a brilliant fusion of engineering, art, and devotion.",
    author: "Rahul Verma",
    date: "August 10, 2026",
    readTime: "6 min read",
    category: "History",
    imageColor: "bg-orange-100",
  },
  {
    _id: "5",
    id: "5",
    title: "Festivals of Meenakshi Amman: Chithirai Thiruvizha",
    excerpt: "Experience the vibrant colors, towering chariots, and immense devotion during the Chithirai festival in Madurai, celebrating the divine marriage of Goddess Meenakshi.",
    content: "Madurai, the cultural capital of Tamil Nadu, revolves around the magnificent Meenakshi Amman Temple. The city comes to a spectacular standstill during its most prominent festival: the Chithirai Thiruvizha.\n\n### The Divine Wedding\nHeld during the Tamil month of Chithirai (April-May), this two-week-long festival celebrates the celestial wedding of Goddess Meenakshi (a form of Parvati) and Lord Sundareshwarar (a form of Shiva).\n\n### The Grand Processions\nThe festival is marked by daily processions where the deities are taken out in elaborate palanquins and mounts. The entire city participates, transforming Madurai into a sea of devotion, music, and vibrant colors. \n\n### The Car Festival (Therottam)\nA major highlight is the Therottam, where massive wooden chariots carrying the deities are pulled through the Masi streets surrounding the temple by thousands of devotees. The sheer scale of the chariots and the rhythmic chanting create an electrifying atmosphere.\n\n### The Arrival of Lord Kallazhagar\nSimultaneously, the festival incorporates the journey of Lord Kallazhagar (a form of Vishnu and Meenakshi's brother). He travels from his abode in Alagar Koyil to the Vaigai river in Madurai to attend the wedding, albeit arriving late. His entry into the Vaigai river on a golden horse mount is a mesmerizing spectacle, drawing lakhs of devotees who drench themselves in water as an act of devotion and celebration.\n\nChithirai Thiruvizha is more than a religious event; it is the cultural heartbeat of Madurai, showcasing the deep integration of faith and daily life in South India.",
    author: "Lakshmi N.",
    date: "August 5, 2026",
    readTime: "7 min read",
    category: "Festivals",
    imageColor: "bg-purple-100",
  }
];

// Global Settings Mock State
let globalSettings = {
  siteName: "YatraSetu",
  supportEmail: "contact@yatrasetu.in",
  supportPhone: "+91 1800-XXX-XXXX",
  address: "New Delhi, India",
  socialFacebook: "https://facebook.com",
  socialInstagram: "https://instagram.com",
  socialWhatsapp: "+919876543210",
  maintenanceMode: false
};

// Users Mock State
let mockUsers = [
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@yatrasetu.in",
    password: "password123", // in a real app this would be hashed
    role: "admin",
    createdAt: new Date().toISOString()
  }
];

// MongoDB Connection Logic
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/yatrasetu';
  
  try {
    await mongoose.connect(mongoUri);
    isMongoConnected = true;
    console.log(`Successfully connected to MongoDB at ${mongoUri}`);
    
    // Seed default admin if no users exist
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const defaultAdmin = new User({
        name: "Admin User",
        email: "admin@yatrasetu.in",
        password: "password123",
        role: "admin"
      });
      await defaultAdmin.save();
      console.log('Seeded default admin user');
    }
  } catch (err) {
    console.warn('\n⚠️ MONGODB NOT CONNECTED ⚠️');
    console.warn('Could not connect to MongoDB. The server will run in "Mock Mode" using an in-memory array.');
    console.warn('To use a real database, ensure MongoDB is running locally or add a valid MONGO_URI to your .env file.\n');
  }
};

connectDB();

// Import Models
const Temple = require('./models/Temple');
const Post = require('./models/Post');
const User = require('./models/User');

// Helper to parse form data
const parseTempleData = async (body, files) => {
  const data = { ...body };
  
  // Parse stringified JSON arrays/objects from FormData
  if (typeof data.rituals === 'string') data.rituals = JSON.parse(data.rituals);
  if (typeof data.timings === 'string') data.timings = JSON.parse(data.timings);
  if (typeof data.facilities === 'string') data.facilities = JSON.parse(data.facilities);
  if (typeof data.guidelines === 'string') data.guidelines = JSON.parse(data.guidelines);
  
  // Parse boolean
  if (data.isFeatured) data.isFeatured = (data.isFeatured === 'true' || data.isFeatured === 'on');
  if (data.isPopular) data.isPopular = (data.isPopular === 'true' || data.isPopular === 'on');
  
  if (data.lat) data.lat = parseFloat(data.lat);
  if (data.lng) data.lng = parseFloat(data.lng);

  // Handle Cover Image
  if (files && files['coverImage'] && files['coverImage'].length > 0) {
    data.coverImage = await uploadToCloudinary(files['coverImage'][0].buffer);
  } else if (data.existingCoverImage) {
    data.coverImage = data.existingCoverImage;
  }

  // Handle Gallery Images
  if (files && files['images'] && files['images'].length > 0) {
    const uploadPromises = files['images'].map(file => uploadToCloudinary(file.buffer));
    const newImages = await Promise.all(uploadPromises);
    
    let existingImages = [];
    if (data.existingImages) {
      existingImages = JSON.parse(data.existingImages);
    }
    data.images = [...existingImages, ...newImages];
  } else if (data.existingImages) {
    data.images = JSON.parse(data.existingImages);
  }

  return data;
};

// Helper to parse post data
const parsePostData = async (body, files) => {
  const data = { ...body };
  if (files && files.length > 0) {
    data.image = await uploadToCloudinary(files[0].buffer);
  } else if (data.existingImage) {
    data.image = data.existingImage;
  }
  return data;
};

// --- API Routes ---

// Get all temples
app.get('/api/temples', async (req, res) => {
  try {
    if (isMongoConnected) {
      const temples = await Temple.find().sort({ createdAt: -1 });
      res.json(temples);
    } else {
      res.json(mockTemples); // Serve mock data
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch temples' });
  }
});

// Create a new temple
app.post('/api/temples', upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'images', maxCount: 5 }]), async (req, res) => {
  try {
    const templeData = await parseTempleData(req.body, req.files);
    
    // Default to pending if submitted by a contributor
    templeData.status = req.body.status || 'pending';
    templeData.authorId = req.body.authorId || null;

    if (isMongoConnected) {
      const newTemple = new Temple(templeData);
      await newTemple.save();
      res.status(201).json(newTemple);
    } else {
      templeData._id = Math.random().toString(36).substr(2, 9);
      templeData.id = templeData._id;
      mockTemples.push(templeData);
      res.status(201).json(templeData);
    }
  } catch (err) {
    res.status(400).json({ error: 'Failed to create temple', details: err.message });
  }
});

// Get single temple by ID
app.get('/api/temples/:id', async (req, res) => {
  try {
    if (isMongoConnected) {
      const temple = await Temple.findById(req.params.id);
      if (!temple) return res.status(404).json({ error: 'Temple not found' });
      res.json(temple);
    } else {
      const temple = mockTemples.find(t => t._id === req.params.id || t.id === req.params.id);
      if (!temple) return res.status(404).json({ error: 'Temple not found' });
      res.json(temple);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch temple' });
  }
});

// Update a temple
app.put('/api/temples/:id', upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'images', maxCount: 5 }]), async (req, res) => {
  try {
    const templeData = await parseTempleData(req.body, req.files);

    if (isMongoConnected) {
      const updatedTemple = await Temple.findByIdAndUpdate(req.params.id, templeData, { new: true });
      if (!updatedTemple) return res.status(404).json({ error: 'Temple not found' });
      res.json(updatedTemple);
    } else {
      const index = mockTemples.findIndex(t => t._id === req.params.id || t.id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'Temple not found' });
      mockTemples[index] = { ...mockTemples[index], ...templeData };
      res.json(mockTemples[index]);
    }
  } catch (err) {
    res.status(400).json({ error: 'Failed to update temple', details: err.message });
  }
});

// Approve a temple
app.put('/api/temples/:id/approve', async (req, res) => {
  try {
    if (isMongoConnected) {
      const updated = await Temple.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
      if (!updated) return res.status(404).json({ error: 'Temple not found' });
      res.json(updated);
    } else {
      const index = mockTemples.findIndex(t => t._id === req.params.id || t.id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'Temple not found' });
      mockTemples[index].status = 'approved';
      res.json(mockTemples[index]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve temple' });
  }
});

// Delete a temple
app.delete('/api/temples/:id', async (req, res) => {
  try {
    if (isMongoConnected) {
      const deletedTemple = await Temple.findByIdAndDelete(req.params.id);
      if (!deletedTemple) return res.status(404).json({ error: 'Temple not found' });
      res.json({ message: 'Temple deleted successfully' });
    } else {
      const initialLength = mockTemples.length;
      mockTemples = mockTemples.filter(t => t._id !== req.params.id && t.id !== req.params.id);
      if (mockTemples.length === initialLength) return res.status(404).json({ error: 'Temple not found' });
      res.json({ message: 'Temple deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete temple' });
  }
});

// --- API Routes for Posts ---

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    if (isMongoConnected) {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.json(posts);
    } else {
      res.json(mockPosts);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a new post
app.post('/api/posts', upload.array('coverImage', 1), async (req, res) => {
  try {
    const postData = await parsePostData(req.body, req.files);
    
    // Default to pending if submitted by a contributor
    postData.status = req.body.status || 'pending';
    postData.authorId = req.body.authorId || null;

    if (isMongoConnected) {
      const newPost = new Post(postData);
      await newPost.save();
      res.status(201).json(newPost);
    } else {
      postData._id = Math.random().toString(36).substr(2, 9);
      postData.id = postData._id;
      mockPosts.push(postData);
      res.status(201).json(postData);
    }
  } catch (err) {
    res.status(400).json({ error: 'Failed to create post', details: err.message });
  }
});

// Get single post by ID
app.get('/api/posts/:id', async (req, res) => {
  try {
    if (isMongoConnected) {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      res.json(post);
    } else {
      const post = mockPosts.find(p => p._id === req.params.id || p.id === req.params.id);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      res.json(post);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Update a post
app.put('/api/posts/:id', upload.array('coverImage', 1), async (req, res) => {
  try {
    const postData = await parsePostData(req.body, req.files);
    if (isMongoConnected) {
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, postData, { new: true });
      if (!updatedPost) return res.status(404).json({ error: 'Post not found' });
      res.json(updatedPost);
    } else {
      const index = mockPosts.findIndex(p => p._id === req.params.id || p.id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'Post not found' });
      mockPosts[index] = { ...mockPosts[index], ...postData };
      res.json(mockPosts[index]);
    }
  } catch (err) {
    res.status(400).json({ error: 'Failed to update post', details: err.message });
  }
});

// Approve a post
app.put('/api/posts/:id/approve', async (req, res) => {
  try {
    if (isMongoConnected) {
      const updated = await Post.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
      if (!updated) return res.status(404).json({ error: 'Post not found' });
      res.json(updated);
    } else {
      const index = mockPosts.findIndex(p => p._id === req.params.id || p.id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'Post not found' });
      mockPosts[index].status = 'approved';
      res.json(mockPosts[index]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve post' });
  }
});

// Delete a post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    if (isMongoConnected) {
      const deletedPost = await Post.findByIdAndDelete(req.params.id);
      if (!deletedPost) return res.status(404).json({ error: 'Post not found' });
      res.json({ message: 'Post deleted successfully' });
    } else {
      const initialLength = mockPosts.length;
      mockPosts = mockPosts.filter(p => p._id !== req.params.id && p.id !== req.params.id);
      if (mockPosts.length === initialLength) return res.status(404).json({ error: 'Post not found' });
      res.json({ message: 'Post deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// --- API Routes for Settings ---
app.get('/api/settings', (req, res) => {
  res.json(globalSettings);
});

app.put('/api/settings', (req, res) => {
  const { siteName, supportEmail, supportPhone, address, socialFacebook, socialInstagram, socialWhatsapp, maintenanceMode } = req.body;
  if (siteName !== undefined) globalSettings.siteName = siteName;
  if (supportEmail !== undefined) globalSettings.supportEmail = supportEmail;
  if (supportPhone !== undefined) globalSettings.supportPhone = supportPhone;
  if (address !== undefined) globalSettings.address = address;
  if (socialFacebook !== undefined) globalSettings.socialFacebook = socialFacebook;
  if (socialInstagram !== undefined) globalSettings.socialInstagram = socialInstagram;
  if (socialWhatsapp !== undefined) globalSettings.socialWhatsapp = socialWhatsapp;
  if (maintenanceMode !== undefined) globalSettings.maintenanceMode = maintenanceMode;
  res.json(globalSettings);
});

// --- API Routes for Users (Auth & Contributors) ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user;
    if (isMongoConnected) {
      user = await User.findOne({ email, password });
    } else {
      user = mockUsers.find(u => u.email === email && u.password === password);
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    let userInfo = user.toObject ? user.toObject() : { ...user };
    userInfo.id = userInfo._id || userInfo.id;
    delete userInfo.password;
    
    res.json({ user: userInfo });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    let users;
    if (isMongoConnected) {
      users = await User.find().sort({ createdAt: -1 });
      users = users.map(u => {
        let obj = u.toObject();
        obj.id = obj._id;
        delete obj.password;
        return obj;
      });
    } else {
      users = mockUsers.map(({ password, ...u }) => u);
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (isMongoConnected) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Email already exists' });
      
      const newUser = new User({ name, email, password, role: role || 'contributor' });
      await newUser.save();
      
      let userInfo = newUser.toObject();
      userInfo.id = userInfo._id;
      delete userInfo.password;
      res.status(201).json(userInfo);
    } else {
      if (mockUsers.some(u => u.email === email)) return res.status(400).json({ error: 'Email already exists' });
      const newUser = { id: "user_" + Date.now(), name, email, password, role: role || "contributor", createdAt: new Date().toISOString() };
      mockUsers.push(newUser);
      const { password: _, ...userInfo } = newUser;
      res.status(201).json(userInfo);
    }
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { name, email, role, password } = req.body;
  try {
    if (isMongoConnected) {
      if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });
      }
      
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (password) updateData.password = password;
      
      const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updatedUser) return res.status(404).json({ error: 'User not found' });
      
      let userInfo = updatedUser.toObject();
      userInfo.id = userInfo._id;
      delete userInfo.password;
      res.json(userInfo);
    } else {
      const index = mockUsers.findIndex(u => u.id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'User not found' });
      
      if (email && email !== mockUsers[index].email && mockUsers.some(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      
      if (name) mockUsers[index].name = name;
      if (email) mockUsers[index].email = email;
      if (role) mockUsers[index].role = role;
      if (password) mockUsers[index].password = password;
      
      const { password: _, ...userInfo } = mockUsers[index];
      res.json(userInfo);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    if (isMongoConnected) {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'User deleted successfully' });
    } else {
      const index = mockUsers.findIndex(u => u.id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'User not found' });
      mockUsers.splice(index, 1);
      res.json({ message: 'User deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
