export interface Circuit {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  heroImage: string;
  history: string;
  bestTimeToVisit: string;
  duration: string;
  temples: {
    name: string;
    location: string;
    description: string;
    lat?: number;
    lng?: number;
  }[];
  journeyGuide?: {
    step: number;
    title: string;
    description: string;
  }[];
}

export const circuits: Circuit[] = [
  {
    id: "char-dham-yatra",
    slug: "char-dham-yatra",
    name: "Char Dham Yatra",
    shortDescription: "A sacred journey to the four divine abodes nestled high in the Himalayas.",
    heroImage: "bg-brand-600",
    history: "The Char Dham Yatra is one of the most revered pilgrimage circuits in Hinduism, established in the 8th century by the great philosopher and reformer Adi Shankaracharya. It comprises four holy sites: Yamunotri, Gangotri, Kedarnath, and Badrinath, all located in the Garhwal region of Uttarakhand, often referred to as 'Devbhoomi' (Land of the Gods). Completing this yatra is believed to wash away one's sins and open the gates to Moksha (salvation).",
    bestTimeToVisit: "May to June and September to October. Avoid the monsoon season (July and August) due to landslides.",
    duration: "10 to 12 days",
    temples: [
      { name: "Yamunotri", location: "Uttarkashi, Uttarakhand", description: "Dedicated to Goddess Yamuna, it marks the source of the Yamuna River.", lat: 31.0140, lng: 78.4600 },
      { name: "Gangotri", location: "Uttarkashi, Uttarakhand", description: "Dedicated to Goddess Ganga, the spiritual source of the holy river Ganges.", lat: 30.9947, lng: 78.9398 },
      { name: "Kedarnath", location: "Rudraprayag, Uttarakhand", description: "One of the 12 Jyotirlingas, dedicated to Lord Shiva, located at 3,583 meters.", lat: 30.7352, lng: 79.0669 },
      { name: "Badrinath", location: "Chamoli, Uttarakhand", description: "Dedicated to Lord Vishnu, it is part of both the major and minor Char Dham circuits.", lat: 30.7433, lng: 79.4938 }
    ],
    journeyGuide: [
      { step: 1, title: "Day 1: Arrival in Haridwar", description: "Begin your spiritual journey at Haridwar. Attend the evening Ganga Aarti at Har Ki Pauri and prepare for the mountain drive." },
      { step: 2, title: "Day 2: Haridwar to Barkot", description: "Drive from Haridwar to Barkot via Mussoorie. Barkot serves as the base camp for the Yamunotri trek." },
      { step: 3, title: "Day 3: Yamunotri Darshan", description: "Drive to Janki Chatti and trek 6km to Yamunotri. Take a holy dip in Tapt Kund, offer prayers, and return to Barkot." },
      { step: 4, title: "Day 4: Barkot to Uttarkashi", description: "Travel to Uttarkashi, a major hub. Visit the famous Vishwanath Temple here in the evening." },
      { step: 5, title: "Day 5: Gangotri Darshan", description: "Drive to Gangotri. Take a holy dip in the Bhagirathi river, perform pooja at the Gangotri temple, and drive back to Uttarkashi." },
      { step: 6, title: "Day 6: Uttarkashi to Guptkashi", description: "A long drive along the Mandakini river takes you to Guptkashi, the gateway to Kedarnath." },
      { step: 7, title: "Day 7-8: Kedarnath Darshan", description: "Trek 16km from Gaurikund to Kedarnath (or take a helicopter). Spend the night, witness the morning Aarti, and trek back." },
      { step: 8, title: "Day 9-10: Kedarnath to Badrinath", description: "Drive via Chopta to Badrinath. Bathe in the Tapt Kund and have Darshan of Badri Vishal. Return to Rishikesh the following day." }
    ]
  },
  {
    id: "12-jyotirlingas",
    slug: "12-jyotirlingas",
    name: "12 Jyotirlingas",
    shortDescription: "The twelve radiant signifiers of the Almighty Lord Shiva across India.",
    heroImage: "bg-brand-700",
    history: "According to the Shiva Purana, once Brahma and Vishnu had an argument over supremacy of creation. To test them, Shiva pierced the three worlds as a huge endless pillar of light, the Jyotirlinga. There are 12 traditional Jyotirlinga shrines in India, representing the manifestation of Shiva as infinite light. Visiting all twelve is considered one of the highest spiritual achievements in a Shaivite's lifetime.",
    bestTimeToVisit: "Can be visited year-round, but Maha Shivaratri (February/March) and the holy month of Shravan (July/August) are highly auspicious.",
    duration: "Varies; usually requires multiple trips due to geographical spread across India.",
    temples: [
      { name: "Somnath", location: "Prabhas Patan, Gujarat", description: "The first among the twelve Jyotirlingas, famously known as the Shrine Eternal.", lat: 20.8880, lng: 70.4010 },
      { name: "Mallikarjuna", location: "Srisailam, Andhra Pradesh", description: "Situated on Shri Shaila Mountain, featuring both a Jyotirlinga and a Shakti Peetha.", lat: 16.0733, lng: 78.8686 },
      { name: "Mahakaleshwar", location: "Ujjain, Madhya Pradesh", description: "The only south-facing Jyotirlinga, famous for its Bhasma Aarti.", lat: 23.1827, lng: 75.7682 },
      { name: "Omkareshwar", location: "Khandwa, Madhya Pradesh", description: "Located on an island in the Narmada river shaped like the symbol 'Om'.", lat: 22.2449, lng: 76.1491 },
      { name: "Kedarnath", location: "Rudraprayag, Uttarakhand", description: "The highest Jyotirlinga, nestled in the snow-capped Himalayas.", lat: 30.7352, lng: 79.0669 },
      { name: "Bhimashankar", location: "Pune, Maharashtra", description: "Set in the Sahyadri mountains, the source of the Bhima river.", lat: 19.0718, lng: 73.5358 },
      { name: "Kashi Vishwanath", location: "Varanasi, Uttar Pradesh", description: "Located in the oldest living city, representing Shiva as the ruler of the universe.", lat: 25.3109, lng: 83.0107 },
      { name: "Trimbakeshwar", location: "Nashik, Maharashtra", description: "Source of the Godavari river, unique for its three-faced Linga.", lat: 19.9324, lng: 73.5284 },
      { name: "Nageshwar", location: "Dwarka, Gujarat", description: "Represents protection from all poisons (snakes).", lat: 22.3353, lng: 69.0146 },
      { name: "Baidyanath", location: "Deoghar, Jharkhand", description: "Also known as Vaijnath, it is where Ravana worshipped Shiva.", lat: 24.4921, lng: 86.6997 },
      { name: "Rameshwaram", location: "Rameswaram, Tamil Nadu", description: "Established by Lord Rama before crossing the sea to Lanka.", lat: 9.2881, lng: 79.3174 },
      { name: "Grishneshwar", location: "Ellora, Maharashtra", description: "Located near the famous Ellora Caves.", lat: 20.0246, lng: 75.1724 }
    ],
    journeyGuide: [
      { step: 1, title: "Sector 1: Western India", description: "Cover Somnath and Nageshwar in Gujarat, then travel down to Maharashtra to visit Trimbakeshwar, Bhimashankar, and Grishneshwar." },
      { step: 2, title: "Sector 2: Central India", description: "Travel to Madhya Pradesh to visit the sacred cities of Ujjain (Mahakaleshwar) and Khandwa (Omkareshwar)." },
      { step: 3, title: "Sector 3: Northern India", description: "Visit the holy city of Varanasi for Kashi Vishwanath, and undertake the Himalayan trek to Kedarnath." },
      { step: 4, title: "Sector 4: Eastern India", description: "Travel to Deoghar in Jharkhand to offer holy water at Baidyanath Jyotirlinga." },
      { step: 5, title: "Sector 5: Southern India", description: "Visit Srisailam in Andhra Pradesh for Mallikarjuna, and finally travel to the island of Rameswaram in Tamil Nadu." }
    ]
  },
  {
    id: "shakti-peethas",
    slug: "shakti-peethas",
    name: "Shakti Peethas",
    shortDescription: "The sacred sites of Goddess Sati's divine presence.",
    heroImage: "bg-brand-500",
    history: "The Shakti Peethas are highly venerated shrines of the Mother Goddess (Shakti). According to Hindu mythology, after the self-immolation of Goddess Sati at the Daksha Yagna, an enraged Lord Shiva performed the Tandava dance carrying her body. To calm Shiva, Lord Vishnu used his Sudarshana Chakra to cut Sati's body. The 51 places where her body parts and jewelry fell on Earth became the sacred Shakti Peethas.",
    bestTimeToVisit: "Navaratri (Spring and Autumn) is the most vibrant and auspicious time to visit these shrines.",
    duration: "Requires extensive travel across the Indian subcontinent.",
    temples: [
      { name: "Kamakhya Temple", location: "Guwahati, Assam", description: "Where Sati's yoni fell. One of the most powerful tantric shrines.", lat: 26.1673, lng: 91.7061 },
      { name: "Kalighat Kali Temple", location: "Kolkata, West Bengal", description: "Where the toes of Sati's right foot fell.", lat: 22.5205, lng: 88.3475 },
      { name: "Karni Mata Temple", location: "Deshnoke, Rajasthan", description: "Famous for the thousands of holy rats living within the temple.", lat: 27.7951, lng: 73.3392 },
      { name: "Vaishno Devi", location: "Katra, Jammu and Kashmir", description: "A major pilgrimage site, though traditionally categorized distinctly, it embodies Shakti.", lat: 33.0298, lng: 74.9481 },
      { name: "Jwala Ji", location: "Kangra, Himachal Pradesh", description: "Where Sati's tongue fell, worshipped as an eternal flame.", lat: 31.8767, lng: 76.3243 }
    ],
    journeyGuide: [
      { step: 1, title: "Northern Circuit", description: "Start your journey in Jammu to visit Vaishno Devi, then travel through the beautiful valleys of Himachal to Jwala Ji." },
      { step: 2, title: "Eastern Circuit", description: "Travel to Kolkata to seek blessings at Kalighat, then fly to Guwahati, Assam to visit the revered Kamakhya Temple atop Nilachal Hill." },
      { step: 3, title: "Western Circuit", description: "Visit the desert state of Rajasthan to pay respects at the unique Karni Mata Temple in Deshnoke." }
    ]
  },
  {
    id: "panch-kedar",
    slug: "panch-kedar",
    name: "Panch Kedar",
    shortDescription: "The five sacred Himalayan shrines of Lord Shiva.",
    heroImage: "bg-brand-800",
    history: "Following the Kurukshetra war in the Mahabharata, the Pandavas sought Lord Shiva to atone for the sins of fratricide. Shiva, wishing to avoid them, took the form of a bull (Nandi) and hid in the Garhwal Himalayas. When Bhima recognized him, Shiva dove into the ground. His body parts rematerialized at five different locations, which are now venerated as the Panch Kedar.",
    bestTimeToVisit: "May to October. The temples are closed in winter due to heavy snowfall.",
    duration: "12 to 14 days of rigorous trekking.",
    temples: [
      { name: "Kedarnath", location: "Garhwal, Uttarakhand", description: "Where the hump of the bull appeared.", lat: 30.7352, lng: 79.0669 },
      { name: "Tungnath", location: "Rudraprayag, Uttarakhand", description: "Where the arms appeared. It is the highest Shiva temple in the world.", lat: 30.4883, lng: 79.2155 },
      { name: "Rudranath", location: "Chamoli, Uttarakhand", description: "Where the face appeared, accessed via a highly challenging trek.", lat: 30.5282, lng: 79.3241 },
      { name: "Madhyamaheshwar", location: "Rudraprayag, Uttarakhand", description: "Where the navel (middle part) appeared.", lat: 30.6385, lng: 79.2274 },
      { name: "Kalpeshwar", location: "Chamoli, Uttarakhand", description: "Where the matted locks (hair) appeared. The only Panch Kedar accessible year-round.", lat: 30.5699, lng: 79.4316 }
    ],
    journeyGuide: [
      { step: 1, title: "Kedarnath Trek", description: "Start from Gaurikund and undertake the 16km trek to Kedarnath at 3583m. Spend the night and trek back." },
      { step: 2, title: "Tungnath Trek", description: "Drive to Chopta, the 'Mini Switzerland of India'. A relatively easy 3.5km trek takes you to Tungnath, the highest Shiva temple." },
      { step: 3, title: "Rudranath Trek", description: "Drive to Sagar village. Begin the rigorous 20km steep ascent through alpine meadows to reach Rudranath." },
      { step: 4, title: "Madhyamaheshwar Trek", description: "Travel to Ransi village. The 16km trek takes you through dense forests and beautiful valleys to Madhyamaheshwar." },
      { step: 5, title: "Kalpeshwar Trek", description: "Drive to Urgam Valley. A short, easy 2km walk takes you to Kalpeshwar, the only temple open year-round." }
    ]
  }
];
