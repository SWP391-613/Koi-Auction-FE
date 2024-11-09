import { faker } from "@faker-js/faker";

interface BlogPost {
  id: number;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  category: "News" | "Health" | "Guide" | "Events" | "Care";
}

const koiBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Japan Fall Harvest 2024 Announcement",
    date: "Oct 3, 2024",
    image: "/blog/japan-harvest.jpg",
    category: "Events",
    excerpt:
      "Follow along as we head to Japan for the annual Fall harvest season...",
    author: "Select Koi",
    readTime: "2 min read",
    content: `
      <div class="space-y-6">
        <p>We're excited to announce our upcoming trip to Japan for the Fall 2024 harvest season! This bi-annual event is one of the most important times in the koi industry, where we hand-select the finest specimens from Japan's most prestigious breeders.</p>

        <h2 class="text-xl font-bold mt-8">What to Expect</h2>
        <p>During this harvest season, we'll be visiting several renowned farms including:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Sakai Fish Farm</li>
          <li>Maruhiro Koi Farm</li>
          <li>Dainichi Koi Farm</li>
          <li>Omosako Koi Farm</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">How to Participate</h2>
        <p>Customers can participate in this exciting event in several ways:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Pre-order specific varieties you're interested in</li>
          <li>Follow our daily updates on social media</li>
          <li>Join our live streams during selections</li>
          <li>Reserve first picks from our new inventory</li>
        </ul>
      </div>
    `,
  },
  {
    id: 2,
    title: "Essential Guide to Koi Health: Prevention and Care",
    date: "Sep 28, 2024",
    image: "/blog/koi-health.jpg",
    category: "Health",
    excerpt:
      "Learn the fundamentals of maintaining optimal koi health through prevention and proper care techniques...",
    author: "Dr. Sarah Chen",
    readTime: "5 min read",
    content: `
      <div class="space-y-6">
        <p>Maintaining the health of your koi is crucial for their longevity and beauty. This comprehensive guide covers essential aspects of koi health management.</p>

        <h2 class="text-xl font-bold mt-8">Daily Health Checks</h2>
        <p>Regular observation is key to early detection of health issues. Watch for:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Swimming patterns and behavior</li>
          <li>Eating habits and appetite</li>
          <li>Physical appearance and skin condition</li>
          <li>Fin movement and position</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Water Quality Management</h2>
        <p>Maintaining proper water parameters is essential:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>pH: 7.0-8.6</li>
          <li>Ammonia: 0 ppm</li>
          <li>Nitrite: 0 ppm</li>
          <li>Nitrate: <30 ppm</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Common Health Issues</h2>
        <p>Be aware of these common problems:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Parasitic infections</li>
          <li>Bacterial infections</li>
          <li>Fungal infections</li>
          <li>Environmental stress</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Preventive Measures</h2>
        <p>Implementation of these preventive measures can significantly reduce health issues:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Regular water testing and maintenance</li>
          <li>Proper filtration system management</li>
          <li>Quarantine procedures for new koi</li>
          <li>Balanced nutrition</li>
        </ul>
      </div>
    `,
  },
  {
    id: 3,
    title: "Selecting the Perfect Koi: A Buyer's Guide",
    date: "Sep 15, 2024",
    image: "/blog/selecting-koi.jpg",
    category: "Guide",
    excerpt:
      "Expert tips on how to select high-quality koi for your collection...",
    author: "Master Tanaka",
    readTime: "4 min read",
    content: `
      <div class="space-y-6">
        <p>Selecting the right koi is both an art and a science. This guide will help you make informed decisions when choosing your next koi.</p>

        <h2 class="text-xl font-bold mt-8">Key Selection Criteria</h2>
        <p>Consider these important factors:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Body conformation and proportions</li>
          <li>Quality and clarity of pattern</li>
          <li>Skin quality and luster</li>
          <li>Swimming behavior and activity</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Pattern Assessment</h2>
        <p>Different varieties have specific pattern requirements:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Kohaku: Clean white base with solid red pattern</li>
          <li>Showa: Balance between black, red, and white</li>
          <li>Sanke: White base with red and black accents</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Size and Age Considerations</h2>
        <p>Understanding growth potential is crucial:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Tosai (1-year-old): Most affordable, highest risk</li>
          <li>Nisai (2-year-old): Better pattern stability</li>
          <li>Sansai (3-year-old): More predictable development</li>
        </ul>
      </div>
    `,
  },
  {
    id: 4,
    title: "Seasonal Koi Care: Winter Preparation",
    date: "Sep 10, 2024",
    image: "/blog/winter-care.jpg",
    category: "Care",
    excerpt:
      "Essential steps to prepare your koi pond for the winter season...",
    author: "Dr. James Wilson",
    readTime: "3 min read",
    content: `
      <div class="space-y-6">
        <p>Proper winter preparation is crucial for the health and survival of your koi during cold months. Follow these guidelines to ensure your koi thrive through winter.</p>

        <h2 class="text-xl font-bold mt-8">Temperature Management</h2>
        <p>As temperatures drop, adjust your care routine:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Monitor water temperature daily</li>
          <li>Reduce feeding at temperatures below 50°F (10°C)</li>
          <li>Stop feeding below 45°F (7°C)</li>
          <li>Consider using pond heaters or de-icers</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Pond Preparation</h2>
        <p>Prepare your pond system:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Clean fallen leaves and debris</li>
          <li>Install pond netting</li>
          <li>Check filtration system</li>
          <li>Ensure adequate depth for winter</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Winter Equipment</h2>
        <p>Essential equipment for winter:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>De-icer or heater</li>
          <li>Air pump for oxygen</li>
          <li>Pond cover or netting</li>
          <li>Temperature monitoring system</li>
        </ul>
      </div>
    `,
  },
  {
    id: 5,
    title: "Understanding Koi Nutrition and Feeding",
    date: "Sep 5, 2024",
    image: "/blog/koi-nutrition.jpg",
    category: "Care",
    excerpt:
      "A comprehensive guide to proper koi nutrition and feeding practices...",
    author: "Dr. Lisa Chang",
    readTime: "4 min read",
    content: `
      <div class="space-y-6">
        <p>Proper nutrition is fundamental to raising healthy, vibrant koi. Learn about dietary requirements and feeding practices.</p>

        <h2 class="text-xl font-bold mt-8">Basic Nutritional Needs</h2>
        <p>Key components of a balanced koi diet:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Proteins (35-40%)</li>
          <li>Fats (3-10%)</li>
          <li>Carbohydrates (30-40%)</li>
          <li>Vitamins and minerals</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Seasonal Feeding Schedule</h2>
        <p>Adjust feeding based on seasons:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Spring: Gradually increase feeding</li>
          <li>Summer: Maximum feeding frequency</li>
          <li>Fall: Reduce feeding amount</li>
          <li>Winter: Minimal to no feeding</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Types of Food</h2>
        <p>Different food options available:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Staple pellet food</li>
          <li>Color-enhancing food</li>
          <li>Growth food</li>
          <li>Wheat germ for winter</li>
        </ul>
      </div>
    `,
  },
  {
    id: 6,
    title: "The Art of Photographing Koi: Tips and Techniques",
    date: "Aug 30, 2024",
    image: "/blog/koi-photography.jpg",
    category: "Guide",
    excerpt:
      "Learn professional techniques for capturing the true beauty and size of koi in photographs...",
    author: "Michael Chen",
    readTime: "3 min read",
    content: `
      <div class="space-y-6">
        <p>Photographing koi presents unique challenges, especially when trying to capture their true size and quality. This guide shares professional insights into koi photography.</p>

        <h2 class="text-xl font-bold mt-8">Equipment Essentials</h2>
        <ul class="list-disc pl-6 mt-4">
          <li>Professional camera with 25mm lens</li>
          <li>Polarized lens filter</li>
          <li>Mounted light (avoid flash)</li>
          <li>Lens hood</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Common Challenges</h2>
        <p>Key difficulties in koi photography include:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Capturing full size of jumbo koi in frame</li>
          <li>Dealing with active, moving subjects</li>
          <li>Maintaining consistent lighting</li>
          <li>Showing accurate scale and proportion</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Professional Tips</h2>
        <ul class="list-disc pl-6 mt-4">
          <li>Use reference objects for scale</li>
          <li>Maintain consistent lighting conditions</li>
          <li>Consider video for better size perspective</li>
          <li>Practice patience with active koi</li>
        </ul>
      </div>
    `,
  },
  {
    id: 7,
    title: "Advanced Koi Feeding Strategies",
    date: "Aug 15, 2024",
    image: "/blog/koi-feeding-advanced.jpg",
    category: "Care",
    excerpt:
      "Master the art of koi feeding with these professional tips for optimal growth and health...",
    author: "Dr. Tanaka Yamamoto",
    readTime: "5 min read",
    content: `
      <div class="space-y-6">
        <p>Proper feeding techniques are crucial for raising healthy, vibrant koi. Learn advanced strategies used by professional koi keepers.</p>

        <h2 class="text-xl font-bold mt-8">Seasonal Feeding Guidelines</h2>
        <ul class="list-disc pl-6 mt-4">
          <li>Spring: Gradually increase feeding as water warms</li>
          <li>Summer: Maximum feeding frequency (3-4 times daily)</li>
          <li>Fall: Reduce feeding amount gradually</li>
          <li>Winter: Minimal feeding below 50°F</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Quality Food Selection</h2>
        <p>Essential nutrients for optimal health:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>High-quality proteins (35-40%)</li>
          <li>Essential amino acids</li>
          <li>Probiotics for digestion</li>
          <li>Color-enhancing ingredients</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Special Considerations</h2>
        <ul class="list-disc pl-6 mt-4">
          <li>Avoid feeding before storms</li>
          <li>Adjust portions based on koi size</li>
          <li>Monitor water quality closely</li>
          <li>Consider automated feeding systems</li>
        </ul>
      </div>
    `,
  },
  {
    id: 8,
    title: "Expert Guide to Koi Selection",
    date: "Aug 1, 2024",
    image: "/blog/koi-selection-guide.jpg",
    category: "Guide",
    excerpt:
      "Learn how to select the perfect koi for your pond with these expert tips...",
    author: "Master Sakai",
    readTime: "6 min read",
    content: `
      <div class="space-y-6">
        <p>Selecting the right koi is both an art and a science. This comprehensive guide will help you make informed decisions when choosing your next koi.</p>

        <h2 class="text-xl font-bold mt-8">Body Quality Assessment</h2>
        <ul class="list-disc pl-6 mt-4">
          <li>Evaluate body shape and proportions</li>
          <li>Check spine alignment</li>
          <li>Assess fin quality and placement</li>
          <li>Look for balanced growth potential</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Pattern Evaluation</h2>
        <p>Key factors in pattern assessment:</p>
        <ul class="list-disc pl-6 mt-4">
          <li>Color intensity and quality</li>
          <li>Pattern balance and symmetry</li>
          <li>Clean edges between colors</li>
          <li>Potential for pattern development</li>
        </ul>

        <h2 class="text-xl font-bold mt-8">Health Indicators</h2>
        <ul class="list-disc pl-6 mt-4">
          <li>Clear, bright eyes</li>
          <li>Smooth, damage-free scales</li>
          <li>Active swimming behavior</li>
          <li>Good appetite and alertness</li>
        </ul>
      </div>
    `,
  },
];

export const generateBlogPostsPreview = (count: number) => {
  return koiBlogPosts.slice(0, count);
};

export const generateBlogPosts = (count: number) => {
  return koiBlogPosts.slice(0, count);
};

export const getBlogPostsByCategory = (category: BlogPost["category"]) => {
  return koiBlogPosts.filter((post) => post.category === category);
};
