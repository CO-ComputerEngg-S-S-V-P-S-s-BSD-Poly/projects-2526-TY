class SmartConsultant:
    """Intelligent recommendation system based on user profession/use-case"""
    
    PROFESSION_MAPPINGS = {
        # Civil/Mech Engineering
        'civil engineer': ['engineering', 'civil', 'mechanical', 'architect'],
        'mechanical engineer': ['engineering', 'cad', 'revit', 'solidworks'],
        'architect': ['cad', 'revit', '3d', 'rendering'],
        
        # Gaming
        'gamer': ['gaming', 'esports', 'streaming', 'pro gamer'],
        'streamer': ['streaming', 'twitch', 'youtube', 'content'],
        
        # Coding/Development
        'coder': ['programming', 'development', 'software', 'web dev'],
        'data scientist': ['data science', 'machine learning', 'ai', 'analytics'],
        'developer': ['coding', 'programming', 'full stack', 'backend'],
        
        # Students
        'student': ['student', 'college', 'university', 'school'],
        'medical student': ['medical', 'anatomy', 'biology', 'research'],
        'engineering student': ['engineering student', 'college', 'project'],
        
        # Creative
        'designer': ['graphic design', 'ui/ux', 'photoshop', 'illustrator'],
        'video editor': ['video editing', 'premiere', 'after effects', 'film'],
    }
    
    PRODUCT_RECOMMENDATIONS = {
        'engineering': {
            'description': 'Workstation for CAD/Revit/SolidWorks',
            'cpu': ['Intel Core i9-14900K', 'AMD Ryzen 9 7950X'],
            'gpu': ['NVIDIA RTX 4090', 'NVIDIA RTX A6000', 'AMD Radeon Pro W7900'],
            'ram': ['64GB DDR5', '128GB DDR5'],
            'monitor': ['4K 32-inch IPS', 'UltraWide 34-inch'],
            'storage': ['2TB NVMe SSD', '4TB NVMe SSD'],
            'priority': ['High Clock Speed CPU', 'Professional GPU', 'Large RAM']
        },
        'gaming': {
            'description': 'High-Performance Gaming Rig',
            'cpu': ['Intel Core i7-14700K', 'AMD Ryzen 7 7800X3D'],
            'gpu': ['NVIDIA RTX 4080 Super', 'NVIDIA RTX 4070 Ti', 'AMD Radeon RX 7900 XTX'],
            'ram': ['32GB DDR5 RGB', '32GB DDR5 6000MHz'],
            'monitor': ['27-inch 240Hz IPS', '34-inch UltraWide 144Hz', 'OLED Gaming Monitor'],
            'storage': ['2TB Gen4 NVMe SSD', '4TB HDD for games'],
            'priority': ['High Refresh Monitor', 'RTX GPU', 'Fast RAM']
        },
        'coding': {
            'description': 'Development Workstation',
            'cpu': ['AMD Ryzen 9 7950X', 'Intel Core i7-14700K'],
            'gpu': ['NVIDIA RTX 4070', 'AMD Radeon RX 7800 XT'],
            'ram': ['64GB DDR5', '32GB DDR5'],
            'monitor': ['Dual 27-inch 4K', 'Vertical 27-inch IPS', 'UltraWide 38-inch'],
            'storage': ['1TB NVMe SSD + 2TB SSD'],
            'priority': ['High RAM (32GB+)', 'Multiple Monitors', 'Fast Storage']
        },
        'student': {
            'description': 'Budget-Friendly Student Setup',
            'cpu': ['AMD Ryzen 5 7600', 'Intel Core i5-13600K'],
            'gpu': ['NVIDIA RTX 4060', 'AMD Radeon RX 7600', 'Integrated Graphics'],
            'ram': ['16GB DDR5', '32GB DDR4'],
            'monitor': ['24-inch 1080p IPS', '27-inch 1440p'],
            'storage': ['1TB NVMe SSD', '512GB SSD + 1TB HDD'],
            'priority': ['Value for Money', 'Reliability', 'Portability']
        },
        'creative': {
            'description': 'Content Creation Powerhouse',
            'cpu': ['Intel Core i9-14900K', 'AMD Threadripper PRO'],
            'gpu': ['NVIDIA RTX 4090', 'NVIDIA RTX 4080'],
            'ram': ['128GB DDR5', '64GB DDR5'],
            'monitor': ['4K 32-inch Color-Accurate', 'Wide Color Gamut Monitor'],
            'storage': ['4TB NVMe SSD RAID', '8TB Storage Array'],
            'priority': ['Color-Accurate Monitor', 'High VRAM GPU', 'Fast Storage']
        }
    }
    
    @staticmethod
    def get_recommendations(user_input):
        """Main recommendation logic"""
        input_lower = user_input.lower()
        matched_category = None
        
        # Find matching category
        for category, keywords in SmartConsultant.PROFESSION_MAPPINGS.items():
            if any(keyword in input_lower for keyword in keywords):
                # Map to broader categories
                if 'engineer' in category or 'architect' in category:
                    matched_category = 'engineering'
                elif 'gamer' in category or 'streamer' in category:
                    matched_category = 'gaming'
                elif 'coder' in category or 'developer' in category or 'data' in category:
                    matched_category = 'coding'
                elif 'student' in category:
                    matched_category = 'student'
                elif 'designer' in category or 'editor' in category:
                    matched_category = 'creative'
                break
        
        # Default to student if no match
        if not matched_category:
            matched_category = 'student'
        
        return SmartConsultant.PRODUCT_RECOMMENDATIONS.get(matched_category, 
               SmartConsultant.PRODUCT_RECOMMENDATIONS['student'])