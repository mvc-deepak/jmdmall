import os
import re
import sqlite3


DB_NAME = "jmdmall.db"


def clean_slug(text):
    if not text:
        return ""
    text = text.lower().strip()
    text = text.replace("&", "and")
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_-]+", "-", text).strip("-")


def branch(name, children=None):
    return {"name": name, "children": children or []}


CATEGORY_TREE = [
    branch("Groceries", [
        branch("Fruits & Vegetables", [
            branch("Fresh Vegetables"),
            branch("Fresh Fruits"),
            branch("Exotic Fruits & Vegetables"),
            branch("Herbs & Coriander"),
            branch("Fresh Cuts & Sprouts"),
            branch("Organic Produce"),
            branch("Flowers & Leaves"),
            branch("Seasonal Produce"),
            branch("Frozen Vegetables"),
            branch("Hydroponic Produce"),
        ]),
        branch("Atta, Rice & Dal", [
            branch("Atta"),
            branch("Rice"),
            branch("Dal & Pulses"),
            branch("Besan, Sooji & Maida"),
            branch("Rajma, Chhole & Beans"),
            branch("Millets & Flour"),
            branch("Poha, Daliya & Grains"),
            branch("Organic Staples"),
        ]),
        branch("Oils, Ghee & Spices", [
            branch("Cooking Oils"),
            branch("Ghee"),
            branch("Powdered Spices"),
            branch("Whole Spices"),
            branch("Meat & Seafood Masalas"),
            branch("Salt, Sugar & Jaggery"),
            branch("Herbs & Seasonings"),
            branch("Curry Pastes & Gravy Mixes"),
            branch("Organic Oils & Spices"),
        ]),
        branch("Dairy, Bread & Eggs", [
            branch("Milk"),
            branch("Bread & Pav"),
            branch("Eggs"),
            branch("Curd & Yogurt"),
            branch("Cheese"),
            branch("Butter"),
            branch("Paneer & Tofu"),
            branch("Cream & Whitener"),
            branch("Soy & Plant-Based Milk"),
            branch("Lassi & Milk Drinks"),
            branch("Idli & Dosa Batter"),
        ]),
        branch("Bakery & Biscuits", [
            branch("Biscuits"),
            branch("Cookies"),
            branch("Cream Biscuits"),
            branch("Healthy & Digestive Biscuits"),
            branch("Marie & Glucose Biscuits"),
            branch("Rusks & Toast"),
            branch("Cakes & Rolls"),
            branch("Baking Ingredients"),
            branch("Gourmet Bakery"),
            branch("Biscuit Gift Packs"),
        ]),
        branch("Dry Fruits & Breakfast", [
            branch("Dry Fruits"),
            branch("Dry Fruit Snacks"),
            branch("Breakfast Cereals"),
            branch("Muesli & Granola"),
            branch("Oats & Daliya"),
            branch("Dates"),
            branch("Seeds"),
            branch("Vermicelli"),
            branch("Organic & Premium"),
            branch("Dry Fruit Gift Packs"),
        ]),
        branch("Chicken, Meat & Seafood", [
            branch("Chicken"),
            branch("Mutton"),
            branch("Fresh Meat"),
            branch("Fish & Seafood"),
            branch("Sausages, Salami & Ham"),
            branch("Exotic Meat"),
            branch("Plant-Based Meat"),
        ]),
        branch("Snacks & Namkeen", [
            branch("Chips & Wafers"),
            branch("Bhujia & Mixtures"),
            branch("Namkeen"),
            branch("Nachos"),
            branch("Healthy Snacks"),
            branch("Popcorn"),
            branch("Papad & Fryums"),
            branch("Premium Snacks"),
            branch("Snack Gift Packs"),
        ]),
        branch("Sweets & Chocolates", [
            branch("Chocolates"),
            branch("Chocolate Packs"),
            branch("Chocolate Gift Packs"),
            branch("Indian Sweets"),
            branch("Candies"),
            branch("Chewing Gum"),
            branch("Premium Chocolates"),
        ]),
        branch("Drinks & Juices", [
            branch("Soft Drinks"),
            branch("Fruit Juices"),
            branch("Zero Sugar Drinks"),
            branch("Energy Drinks"),
            branch("Sports & Hydration Drinks"),
            branch("Soda & Mixers"),
            branch("Packaged Water"),
            branch("Coconut Water"),
            branch("Mango Drinks"),
            branch("Syrups & Concentrates"),
            branch("Premium Beverages"),
            branch("Beverage Gift Packs"),
        ]),
        branch("Tea, Coffee & Hot Drinks", [
            branch("Tea"),
            branch("Green Tea"),
            branch("Herbal Tea & Infusions"),
            branch("Coffee"),
            branch("Hot Chocolate"),
            branch("Milk Drink Mixes"),
            branch("Instant Premixes"),
            branch("Premium Tea & Coffee"),
        ]),
        branch("Instant Foods", [
            branch("Noodles"),
            branch("Pasta"),
            branch("Soups"),
            branch("Ready to Eat Meals"),
            branch("Dessert Mixes"),
            branch("Cake Mixes"),
            branch("Organic & Premium"),
        ]),
        branch("Frozen Foods", [
            branch("Frozen Vegetables"),
            branch("Frozen Veg Snacks"),
            branch("Frozen Non-Veg Snacks"),
            branch("Frozen Seafood"),
            branch("Frozen Meat"),
            branch("Frozen Ready Meals"),
        ]),
        branch("Sauces & Spreads", [
            branch("Tomato Ketchup"),
            branch("Mayonnaise"),
            branch("Peanut Butter"),
            branch("Jams & Fruit Spreads"),
            branch("Honey"),
            branch("Chutneys & Pickles"),
            branch("Asian Sauces"),
            branch("Cooking Sauces"),
            branch("Dips & Salad Dressings"),
            branch("Premium Sauces"),
        ]),
        branch("Ice Creams & Desserts", [
            branch("Tubs"),
            branch("Cones"),
            branch("Sticks"),
            branch("Cups"),
            branch("Cassata & Sandwiches"),
            branch("Ice Cream Cakes"),
            branch("Sugar-Free & Guilt-Free"),
            branch("Gourmet Ice Cream"),
            branch("Dessert Syrups"),
        ]),
        branch("Organic Foods", [
            branch("Organic Fruits & Vegetables"),
            branch("Organic Atta & Rice"),
            branch("Organic Dal"),
            branch("Organic Oils"),
            branch("Organic Spices"),
            branch("Organic Snacks"),
            branch("Organic Beverages"),
        ]),
        branch("Baby Food", [
            branch("Infant Formula"),
            branch("Baby Cereals"),
            branch("Purees"),
            branch("Baby Snacks"),
            branch("Baby Drinks"),
        ]),
        branch("Pet Food"),
    ]),
    branch("Electronics", [
        branch("Mobiles & Tablets"),
        branch("Laptops & Computers"),
        branch("Mobile Accessories", [
            branch("Chargers"),
            branch("USB Cables"),
            branch("Cases"),
            branch("Screen Protectors"),
            branch("Power Banks"),
            branch("Selfie Sticks"),
            branch("Memory Cards"),
            branch("Car Chargers"),
            branch("Mobile Holders"),
        ]),
        branch("Computer Accessories", [
            branch("Keyboard"),
            branch("Mouse"),
            branch("Webcam"),
            branch("Headsets"),
            branch("Laptop Bags"),
            branch("Cooling Pads"),
            branch("USB Hubs"),
            branch("Docking Stations"),
            branch("Laptop Batteries"),
            branch("Laptop Chargers"),
        ]),
        branch("Smart Watches & Wearables"),
        branch("Audio", [
            branch("Earphones & Headphones"),
            branch("Speakers"),
            branch("Soundbars"),
            branch("Home Audio"),
        ]),
        branch("Cameras"),
        branch("Gaming"),
        branch("Networking"),
        branch("Smart Home"),
        branch("Chargers & Cables"),
        branch("Batteries & Power"),
        branch("Musical Instruments"),
    ]),
    branch("Home & Kitchen", [
        branch("Home Appliances", [
            branch("Air Conditioners"),
            branch("Air Coolers"),
            branch("Refrigerators"),
            branch("Washing Machines"),
            branch("Water Purifiers"),
            branch("Vacuum Cleaners"),
            branch("Fans"),
            branch("Geysers"),
            branch("Room Heaters"),
        ]),
        branch("Kitchen Appliances", [
            branch("Mixer Grinders"),
            branch("Juicers & Blenders"),
            branch("Microwave Ovens"),
            branch("OTGs"),
            branch("Air Fryers"),
            branch("Rice Cookers"),
            branch("Electric Kettles"),
            branch("Coffee Makers"),
            branch("Toasters"),
            branch("Sandwich Makers"),
            branch("Food Processors"),
            branch("Induction Cooktops"),
            branch("Chimneys"),
            branch("Dishwashers"),
        ]),
        branch("Home & Living"),
        branch("Kitchen & Dining", [
            branch("Water Bottles & Flasks"),
            branch("Lunch Boxes"),
            branch("Mugs & Cups"),
            branch("Glasses & Tumblers"),
            branch("Dinnerware"),
            branch("Serveware"),
            branch("Cookware"),
            branch("Pressure Cookers"),
            branch("Cookware Sets"),
            branch("Bakeware"),
            branch("Kitchen Tools & Gadgets"),
            branch("Knives & Cutting Tools"),
            branch("Chopping Boards"),
            branch("Storage Containers"),
            branch("Food Storage Bags"),
            branch("Spice Jars & Racks"),
            branch("Water Filters & Jugs"),
            branch("Barware"),
            branch("Coffee & Tea Accessories"),
            branch("Tissues & Disposable Tableware"),
            branch("Kitchen Towels & Napkins"),
            branch("Cleaning Accessories"),
            branch("Kitchen Organizers"),
        ]),
        branch("Furniture", [
            branch("Living Room Furniture"),
            branch("Bedroom Furniture"),
            branch("Dining Room Furniture"),
            branch("Office Furniture"),
            branch("Kids Furniture"),
            branch("Kitchen Furniture"),
            branch("Outdoor Furniture"),
            branch("Storage Furniture"),
            branch("Chairs & Seating"),
            branch("Tables & Desks"),
            branch("Shelves & Bookcases"),
            branch("Shoe Racks"),
            branch("TV Units"),
            branch("Bean Bags"),
            branch("Furniture Accessories"),
        ]),
        branch("Home Decor", [
            branch("Wall Decor"),
            branch("Wall Clocks"),
            branch("Paintings & Posters"),
            branch("Photo Frames"),
            branch("Mirrors"),
            branch("Artificial Plants & Flowers"),
            branch("Vases"),
            branch("Decorative Showpieces"),
            branch("Candles & Candle Holders"),
            branch("Decorative Lights"),
            branch("Fountains"),
            branch("Clocks"),
            branch("Aroma & Diffusers"),
            branch("Wind Chimes"),
            branch("Seasonal Decor"),
            branch("Festival Decor"),
            branch("Home Fragrances"),
        ]),
        branch("Home Furnishing", [
            branch("Bedsheets"),
            branch("Blankets & Quilts"),
            branch("Comforters & Duvets"),
            branch("Pillows & Cushions"),
            branch("Mattress Protectors"),
            branch("Curtains & Blinds"),
            branch("Carpets & Rugs"),
            branch("Door Mats"),
            branch("Towels"),
            branch("Table Linen"),
            branch("Sofa Covers"),
            branch("Chair Covers"),
            branch("Mosquito Nets"),
            branch("Baby Bedding"),
            branch("Seasonal Furnishings"),
        ]),
        branch("Storage & Organization", [
            branch("Storage Boxes & Bins"),
            branch("Wardrobe Organizers"),
            branch("Kitchen Storage"),
            branch("Drawer Organizers"),
            branch("Shelves & Racks"),
            branch("Hangers & Garment Care"),
            branch("Laundry Storage"),
            branch("Shoe Storage"),
            branch("Storage Bags"),
            branch("Hooks & Holders"),
            branch("Cabinet Organizers"),
            branch("Office Organization"),
            branch("Travel Organizers"),
            branch("Moving & Packing Supplies"),
        ]),
        branch("Cleaning & Household", [
            branch("Laundry Care", [
                branch("Detergent Powder"),
                branch("Liquid Detergent"),
                branch("Fabric Conditioner"),
                branch("Stain Removers"),
                branch("Laundry Additives"),
                branch("Bleach"),
                branch("Fabric Whitener"),
                branch("Colour Protect"),
                branch("Dryer Sheets"),
                branch("Washing Machine Cleaner"),
            ]),
            branch("Dishwashing"),
            branch("Floor & Surface Cleaners"),
            branch("Bathroom Cleaners"),
            branch("Kitchen Cleaners"),
            branch("Glass & Metal Cleaners"),
            branch("Cleaning Tools"),
            branch("Garbage Bags"),
            branch("Pest Control"),
            branch("Air Fresheners"),
            branch("Shoe Care"),
            branch("Appliance Cleaners"),
            branch("Household Consumables"),
        ]),
        branch("Bathroom Accessories", [
            branch("Bathroom Organizers"),
            branch("Soap Dispensers & Dishes"),
            branch("Toothbrush Holders"),
            branch("Shower Accessories"),
            branch("Towel Accessories"),
            branch("Mirrors"),
            branch("Bathroom Mats"),
            branch("Shower Curtains"),
            branch("Toilet Accessories"),
            branch("Shelves & Racks"),
            branch("Buckets & Mugs"),
            branch("Laundry Baskets"),
            branch("Bathroom Hardware"),
            branch("Bathroom Sets"),
        ]),
        branch("Lighting"),
        branch("Garden & Outdoor", [
            branch("Plants & Seeds"),
            branch("Pots & Planters"),
            branch("Gardening Tools"),
            branch("Fertilizers & Plant Care"),
            branch("Watering Equipment"),
            branch("Garden Decor"),
            branch("Outdoor Furniture"),
            branch("Outdoor Lighting"),
            branch("Barbecue & Grilling"),
            branch("Pest Control"),
            branch("Artificial Grass"),
            branch("Bird Feeders & Houses"),
            branch("Composting"),
            branch("Outdoor Storage"),
        ]),
        branch("Pooja Essentials", [
            branch("Diyas & Lamps"),
            branch("Agarbatti & Dhoop"),
            branch("Camphor"),
            branch("Cotton Wicks"),
            branch("Pooja Thalis"),
            branch("Bells"),
            branch("Kalash"),
            branch("Incense Holders"),
            branch("Idols & Murtis"),
            branch("Photo Frames"),
            branch("Pooja Accessories"),
            branch("Kumkum & Roli"),
            branch("Chandan"),
            branch("Sindoor"),
            branch("Hawan Samagri"),
            branch("Pooja Samagri Kits"),
            branch("Temple Decor"),
            branch("Sacred Threads"),
            branch("Rudraksha"),
            branch("Tulsi Mala"),
            branch("Festival Pooja Kits"),
        ]),
        branch("Party & Festive", [
            branch("Decorations"),
            branch("Balloons"),
            branch("Disposable Party Tableware"),
            branch("Candles"),
            branch("Festival Decor"),
            branch("Gift Wrap"),
            branch("Return Gifts"),
        ]),
    ]),
    branch("Beauty & Personal Care", [
        branch("Bath & Body", [
            branch("Bathing Soaps"),
            branch("Body Wash & Shower Gels"),
            branch("Body Scrubs"),
            branch("Hand Wash"),
            branch("Body Lotions"),
            branch("Body Oils"),
            branch("Deodorants & Roll-Ons"),
            branch("Talcum Powder"),
            branch("Bath Accessories"),
            branch("Gift Sets"),
        ]),
        branch("Hair Care", [
            branch("Shampoo"),
            branch("Conditioner"),
            branch("Hair Oil"),
            branch("Hair Cream"),
            branch("Hair Serum"),
            branch("Hair Colour"),
            branch("Hair Accessories"),
        ]),
        branch("Skin Care", [
            branch("Face Wash & Cleansers"),
            branch("Face Moisturisers"),
            branch("Sunscreen"),
            branch("Face Serums & Essences"),
            branch("Face Oils"),
            branch("Toners & Mists"),
            branch("Face Masks & Packs"),
            branch("Lip Care"),
            branch("Eye Care"),
            branch("Acne & Blackhead Care"),
            branch("Body Lotions & Oils"),
        ]),
        branch("Beauty & Cosmetics", [
            branch("Lipstick & Lip Gloss"),
            branch("Foundation & Compact"),
            branch("Primer"),
            branch("Concealer"),
            branch("Blush"),
            branch("Highlighter"),
            branch("Kajal"),
            branch("Eyeliners"),
            branch("Nail Polish"),
            branch("Nail Accessories"),
            branch("Makeup Removers"),
            branch("Makeup Brushes & Sponges"),
            branch("Beauty Accessories"),
            branch("Bindi"),
            branch("Bangles"),
            branch("Beauty Gift Sets"),
        ]),
        branch("Oral Care", [
            branch("Toothpaste"),
            branch("Toothbrushes"),
            branch("Mouthwash"),
            branch("Dental Floss"),
            branch("Tongue Cleaners"),
            branch("Teeth Whitening"),
        ]),
        branch("Fragrances"),
        branch("Men's Grooming"),
        branch("Women's Grooming"),
        branch("Personal Care Appliances", [
            branch("Beard Trimmers"),
            branch("Hair Clippers"),
            branch("Electric Shavers"),
            branch("Hair Dryers"),
            branch("Hair Straighteners"),
            branch("Hair Curlers"),
            branch("Epilators"),
            branch("Grooming Kits"),
        ]),
        branch("Feminine Care", [
            branch("Sanitary Pads"),
            branch("Tampons"),
            branch("Menstrual Cups"),
            branch("Period Panties"),
            branch("Period Pain Relief"),
            branch("Intimate Wash"),
            branch("Intimate Wipes"),
            branch("Hair Removal"),
            branch("Mom Care"),
        ]),
    ]),
    branch("Health & Wellness", [
        branch("Medicines"),
        branch("Vitamins & Supplements"),
        branch("Protein & Nutrition"),
        branch("First Aid"),
        branch("Personal Health Care"),
        branch("Diabetes Care"),
        branch("Orthopedic Supports"),
        branch("Eye & Ear Care"),
        branch("Women's Health"),
        branch("Sexual Wellness", [
            branch("Condoms"),
            branch("Lubricants"),
            branch("Intimate Massagers"),
            branch("Sexual Wellness Supplements"),
            branch("Fertility & Ovulation Test Kits"),
            branch("Pregnancy Test Kits"),
            branch("Sexual Health Medicines"),
        ]),
    ]),
    branch("Baby & Mom", [
        branch("Diapers & Wipes"),
        branch("Baby Food"),
        branch("Bath & Skin Care"),
        branch("Hair Care"),
        branch("Oral Care"),
        branch("Feeding Essentials"),
        branch("Clothing & Accessories"),
        branch("Health & Hygiene"),
        branch("Toys & Gifts"),
        branch("Baby Gear"),
        branch("Mom Care"),
    ]),
    branch("Fashion", [
        branch("Men"),
        branch("Women"),
        branch("Kids"),
        branch("Innerwear"),
        branch("Winter Wear"),
        branch("Ethnic Wear"),
        branch("Western Wear"),
        branch("Sportswear"),
        branch("Fashion Accessories", [
            branch("Wallets"),
            branch("Belts"),
            branch("Caps & Hats"),
            branch("Sunglasses"),
            branch("Scarves & Stoles"),
            branch("Gloves"),
            branch("Ties & Bow Ties"),
            branch("Handkerchiefs"),
            branch("Umbrellas"),
            branch("Hair Accessories"),
            branch("Socks"),
            branch("Suspenders"),
            branch("Cufflinks"),
            branch("Brooches"),
            branch("Fashion Masks"),
        ]),
    ]),
    branch("Jewellery & Watches", [
        branch("Gold Jewellery"),
        branch("Silver Jewellery"),
        branch("Fashion Jewellery"),
        branch("Men's Watches"),
        branch("Women's Watches"),
        branch("Smart Watches"),
        branch("Kids Watches"),
    ]),
    branch("Bags & Luggage", [
        branch("Backpacks"),
        branch("Handbags"),
        branch("Wallets"),
        branch("Travel Bags"),
        branch("Suitcases"),
        branch("Laptop Bags"),
        branch("School Bags"),
    ]),
    branch("Sports & Fitness", [
        branch("Exercise & Gym Equipment"),
        branch("Yoga & Pilates"),
        branch("Cardio Equipment"),
        branch("Strength Training"),
        branch("Sports Accessories"),
        branch("Cricket"),
        branch("Football"),
        branch("Badminton"),
        branch("Table Tennis"),
        branch("Basketball"),
        branch("Volleyball"),
        branch("Tennis"),
        branch("Swimming"),
        branch("Cycling"),
        branch("Running"),
        branch("Hiking & Camping"),
        branch("Outdoor Recreation"),
        branch("Martial Arts"),
        branch("Fitness Trackers & Accessories"),
        branch("Sports Nutrition"),
        branch("Trophies & Medals"),
    ]),
    branch("Books & Stationery", [
        branch("Books"),
        branch("School Supplies"),
        branch("Office Supplies"),
        branch("Writing Instruments"),
        branch("Paper Products"),
        branch("Arts & Crafts"),
        branch("Educational Supplies"),
        branch("Files & Folders"),
        branch("Gift Wrapping"),
        branch("Calendars & Planners"),
        branch("Calculators"),
    ]),
    branch("Office & Business Supplies", [
        branch("Office Stationery"),
        branch("Office Paper"),
        branch("Printers & Scanners"),
        branch("Printer Ink & Toner"),
        branch("Office Electronics"),
        branch("Office Furniture"),
        branch("Filing & Storage"),
        branch("Desk Organization"),
        branch("Whiteboards & Presentation"),
        branch("Packaging & Shipping"),
        branch("Business Machines"),
        branch("Cash Handling"),
        branch("Office Pantry"),
        branch("Safety & Security"),
    ]),
    branch("Toys & Games", [
        branch("Baby & Toddler Toys"),
        branch("Educational Toys"),
        branch("Building Blocks"),
        branch("Dolls & Doll Houses"),
        branch("Action Figures"),
        branch("Remote Control Toys"),
        branch("Vehicles & Die-Cast Toys"),
        branch("Soft Toys"),
        branch("Board Games"),
        branch("Puzzles"),
        branch("Arts & Crafts Kits"),
        branch("Musical Toys"),
        branch("Outdoor Play"),
        branch("Ride-On Toys"),
        branch("Toy Guns & Blasters"),
        branch("Pretend Play"),
        branch("Collectibles"),
        branch("Party Toys"),
        branch("Video Games"),
        branch("Toy Accessories"),
    ]),
    branch("Automotive", [
        branch("Car Accessories"),
        branch("Bike & Scooter Accessories"),
        branch("Car Care"),
        branch("Oils & Fluids"),
        branch("Tyres & Wheels"),
        branch("Batteries"),
        branch("Lighting"),
        branch("Interior Accessories"),
        branch("Exterior Accessories"),
        branch("Mobile Holders & Chargers"),
        branch("Helmets & Riding Gear"),
        branch("Tools & Emergency Kits"),
        branch("Performance Parts"),
        branch("GPS & Dash Cameras"),
        branch("Bicycle Accessories"),
    ]),
    branch("Pet Supplies", [
        branch("Dog Supplies"),
        branch("Cat Supplies"),
        branch("Bird Supplies"),
        branch("Fish & Aquarium"),
        branch("Small Animal Supplies"),
        branch("Pet Food"),
        branch("Pet Treats"),
        branch("Grooming"),
        branch("Health & Wellness"),
        branch("Beds & Furniture"),
        branch("Toys"),
        branch("Collars, Leashes & Harnesses"),
        branch("Feeding Supplies"),
        branch("Travel & Outdoor"),
        branch("Cleaning & Hygiene"),
    ]),
    branch("Industrial Supplies", [
        branch("Power Tools"),
        branch("Hand Tools"),
        branch("Safety Equipment"),
        branch("Electrical Supplies"),
        branch("Hardware"),
        branch("Plumbing Supplies"),
        branch("Welding Equipment"),
        branch("Industrial Fasteners"),
        branch("Adhesives & Sealants"),
        branch("Measuring Tools"),
        branch("Material Handling"),
        branch("Cleaning Equipment"),
        branch("Packaging Supplies"),
        branch("Lab & Scientific"),
        branch("Pneumatic Tools"),
        branch("Hydraulic Equipment"),
        branch("Generators & Power"),
        branch("Industrial Machinery"),
    ]),
    branch("Tobacco & Smoking"),
    branch("Gift Cards"),
]


def create_tables(cursor):
    cursor.execute("PRAGMA foreign_keys = OFF;")
    cursor.execute("DROP TRIGGER IF EXISTS products_ai;")
    cursor.execute("DROP TRIGGER IF EXISTS products_au;")
    cursor.execute("DROP TRIGGER IF EXISTS products_ad;")
    cursor.execute("DROP TABLE IF EXISTS products_fts;")
    cursor.execute("DROP TABLE IF EXISTS vendor_offers;")
    cursor.execute("DROP TABLE IF EXISTS product_variants;")
    cursor.execute("DROP TABLE IF EXISTS product_attributes;")
    cursor.execute("DROP TABLE IF EXISTS product_images;")
    cursor.execute("DROP TABLE IF EXISTS product_categories;")
    cursor.execute("DROP TABLE IF EXISTS products;")
    cursor.execute("DROP TABLE IF EXISTS subcategories;")
    cursor.execute("DROP TABLE IF EXISTS categories;")
    cursor.execute("PRAGMA foreign_keys = ON;")

    cursor.execute(
        """
        CREATE TABLE categories (
            category_id TEXT PRIMARY KEY,
            parent_id TEXT,
            name TEXT NOT NULL,
            slug TEXT NOT NULL,
            path TEXT NOT NULL UNIQUE,
            level INTEGER NOT NULL,
            image TEXT,
            description TEXT,
            display_order INTEGER NOT NULL,
            status TEXT DEFAULT 'active',
            FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE CASCADE,
            UNIQUE (parent_id, slug)
        );
        """
    )

    cursor.execute(
        """
        CREATE INDEX idx_categories_parent_id
        ON categories (parent_id);
        """
    )

    cursor.execute(
        """
        CREATE INDEX idx_categories_level
        ON categories (level);
        """
    )

    cursor.execute(
        """
        CREATE TABLE products (
            product_id TEXT PRIMARY KEY,
            product_code TEXT,
            name TEXT NOT NULL,
            product_slug TEXT NOT NULL UNIQUE,
            brand TEXT,
            manufacturer TEXT,
            short_description TEXT,
            long_description TEXT,
            thumbnail_image TEXT,
            metadata_tags TEXT,
            metadata_seo_keywords TEXT,
            primary_category_id TEXT,
            source_vendor TEXT,
            source_product_id TEXT,
            source_url TEXT,
            country_of_origin TEXT,
            shelf_life TEXT,
            fssai_license TEXT,
            is_featured INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (primary_category_id) REFERENCES categories(category_id) ON DELETE SET NULL
        );
        """
    )

    cursor.execute(
        """
        CREATE TABLE product_categories (
            product_id TEXT NOT NULL,
            category_id TEXT NOT NULL,
            is_primary INTEGER DEFAULT 0,
            display_order INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (product_id, category_id),
            FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
        );
        """
    )

    cursor.execute(
        """
        CREATE TABLE product_images (
            image_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT NOT NULL,
            image_url TEXT NOT NULL,
            alt_text TEXT,
            display_order INTEGER DEFAULT 0,
            is_primary INTEGER DEFAULT 0,
            source_vendor TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
        );
        """
    )

    cursor.execute(
        """
        CREATE TABLE product_attributes (
            attribute_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT NOT NULL,
            attribute_group TEXT DEFAULT 'General',
            attribute_name TEXT NOT NULL,
            attribute_value TEXT,
            display_order INTEGER DEFAULT 0,
            is_filterable INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
            UNIQUE (product_id, attribute_group, attribute_name)
        );
        """
    )

    cursor.execute(
        """
        CREATE TABLE product_variants (
            variant_id TEXT PRIMARY KEY,
            product_id TEXT NOT NULL,
            source_vendor TEXT NOT NULL,
            source_product_id TEXT,
            source_group_id TEXT,
            unit TEXT,
            price REAL,
            original_price REAL,
            discount_percentage REAL,
            currency TEXT DEFAULT 'INR',
            stock_status TEXT DEFAULT 'OUT_OF_STOCK',
            stock_quantity INTEGER DEFAULT 0,
            is_default INTEGER DEFAULT 0,
            raw_data TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
        );
        """
    )

    cursor.execute(
        """
        CREATE TABLE vendor_offers (
            offer_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT NOT NULL,
            sku TEXT,
            source_vendor TEXT NOT NULL,
            source_product_id TEXT,
            source_merchant_id TEXT,
            source_group_id TEXT,
            source_url TEXT,
            source_date TEXT DEFAULT CURRENT_TIMESTAMP,
            price REAL NOT NULL,
            original_price REAL,
            discount_percentage REAL,
            currency TEXT DEFAULT 'INR',
            warranty TEXT,
            is_returnable INTEGER DEFAULT 1,
            is_cancellable INTEGER DEFAULT 1,
            delivery_fee REAL DEFAULT 0.00,
            convenience_fee REAL DEFAULT 0.00,
            shipping_charge REAL DEFAULT 0.00,
            is_cod_eligible INTEGER DEFAULT 1,
            cod_fee REAL DEFAULT 0.00,
            assurance TEXT,
            badge TEXT,
            rating REAL,
            total_reviews INTEGER,
            merchant_type TEXT,
            unit TEXT,
            min_order_quantity INTEGER DEFAULT 1,
            max_order_quantity INTEGER,
            stock_status TEXT DEFAULT 'OUT_OF_STOCK',
            stock_quantity INTEGER DEFAULT 0,
            stock_alert_text TEXT,
            is_available_instantly INTEGER DEFAULT 0,
            estimated_delivery_days INTEGER,
            target_pincode TEXT,
            raw_offer_data TEXT,
            last_checked_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
        );
        """
    )

    cursor.execute(
        """
        CREATE UNIQUE INDEX idx_vendor_product
        ON vendor_offers (product_id, source_vendor);
        """
    )

    cursor.execute("CREATE INDEX idx_products_slug ON products (product_slug);")
    cursor.execute("CREATE INDEX idx_products_brand ON products (brand);")
    cursor.execute("CREATE INDEX idx_products_status ON products (status);")
    cursor.execute("CREATE INDEX idx_products_primary_category ON products (primary_category_id);")
    cursor.execute("CREATE INDEX idx_products_source ON products (source_vendor, source_product_id);")
    cursor.execute("CREATE INDEX idx_product_categories_category ON product_categories (category_id);")
    cursor.execute("CREATE INDEX idx_product_images_product ON product_images (product_id, display_order);")
    cursor.execute("CREATE INDEX idx_product_attributes_product ON product_attributes (product_id);")
    cursor.execute("CREATE INDEX idx_product_attributes_name ON product_attributes (attribute_name);")
    cursor.execute("CREATE INDEX idx_product_variants_product ON product_variants (product_id);")
    cursor.execute("CREATE INDEX idx_product_variants_source ON product_variants (source_vendor, source_product_id);")
    cursor.execute("CREATE INDEX idx_vendor_offers_vendor ON vendor_offers (source_vendor);")
    cursor.execute("CREATE INDEX idx_vendor_offers_price ON vendor_offers (price);")
    cursor.execute("CREATE INDEX idx_vendor_offers_stock ON vendor_offers (stock_status, stock_quantity);")

    cursor.execute(
        """
        CREATE VIRTUAL TABLE products_fts USING fts5(
            product_id UNINDEXED,
            name,
            brand,
            short_description,
            long_description,
            metadata_tags
        );
        """
    )

    cursor.execute(
        """
        CREATE TRIGGER products_ai AFTER INSERT ON products BEGIN
            INSERT INTO products_fts
                (product_id, name, brand, short_description, long_description, metadata_tags)
            VALUES
                (new.product_id, new.name, new.brand, new.short_description,
                 new.long_description, new.metadata_tags);
        END;
        """
    )

    cursor.execute(
        """
        CREATE TRIGGER products_ad AFTER DELETE ON products BEGIN
            DELETE FROM products_fts WHERE product_id = old.product_id;
        END;
        """
    )

    cursor.execute(
        """
        CREATE TRIGGER products_au AFTER UPDATE ON products BEGIN
            DELETE FROM products_fts WHERE product_id = old.product_id;
            INSERT INTO products_fts
                (product_id, name, brand, short_description, long_description, metadata_tags)
            VALUES
                (new.product_id, new.name, new.brand, new.short_description,
                 new.long_description, new.metadata_tags);
        END;
        """
    )


def insert_category_tree(cursor, nodes, parent_id=None, parent_path="", level=1, id_prefix="CAT"):
    inserted_count = 0

    for display_order, node in enumerate(nodes, start=1):
        slug = clean_slug(node["name"])
        category_id = f"{id_prefix}-{display_order:03d}"
        path = f"{parent_path}/{slug}" if parent_path else slug
        image = f"images/categories/{path.replace('/', '_')}.jpg" if level == 1 else None
        description = f"{node['name']} products."

        cursor.execute(
            """
            INSERT INTO categories
                (category_id, parent_id, name, slug, path, level, image, description, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            """,
            (
                category_id,
                parent_id,
                node["name"],
                slug,
                path,
                level,
                image,
                description,
                display_order,
            ),
        )
        inserted_count += 1

        inserted_count += insert_category_tree(
            cursor=cursor,
            nodes=node["children"],
            parent_id=category_id,
            parent_path=path,
            level=level + 1,
            id_prefix=category_id,
        )

    return inserted_count


def create_jmdmall_database(db_name=DB_NAME):
    db_path = os.path.abspath(db_name)

    print("=" * 72)
    print("JMDMALL SQLITE DATABASE RECREATE")
    print("=" * 72)
    print(f"Database path: {db_path}")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")

    print("Recreating tables...")
    create_tables(cursor)

    print("Seeding flexible category tree...")
    category_count = insert_category_tree(cursor, CATEGORY_TREE)

    conn.commit()

    cursor.execute("SELECT COUNT(*) FROM categories;")
    live_category_count = cursor.fetchone()[0]
    cursor.execute("SELECT level, COUNT(*) FROM categories GROUP BY level ORDER BY level;")
    level_counts = cursor.fetchall()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
    tables = [row[0] for row in cursor.fetchall()]

    conn.close()

    print("\nDatabase setup complete.")
    print(f"Categories seeded: {category_count} ({live_category_count} verified)")
    print("Category levels:")
    for level, count in level_counts:
        print(f" - Level {level}: {count}")
    print("Tables:")
    for table in tables:
        print(f" - {table}")


if __name__ == "__main__":
    create_jmdmall_database()
