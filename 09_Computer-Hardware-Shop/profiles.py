# profiles.py
profiles = [
    {
        'id': 'civil_engineer',
        'name': 'Civil Engineering Student',
        'keywords': ['civil', 'engineer', 'student', 'cad', 'revit', 'autocad', 'staad', 'etabs'],
        'hardware': {
            'cpu': ['Intel Core i7-13700K', 'AMD Ryzen 7 7800X3D'],
            'gpu': ['NVIDIA RTX 4060', 'NVIDIA RTX 4070'],
            'ram': ['32GB DDR5', '16GB DDR4'],
            'monitor': ['27-inch 1440p', 'Dual 24-inch'],
            'storage': ['1TB NVMe SSD', '2TB HDD']
        },
        'software': ['AutoCAD', 'Revit', 'STAAD Pro', 'ETABS', 'SketchUp'],
        'description': 'For civil engineering students, we recommend a balanced system with a strong CPU for CAD software and a capable GPU for 3D modeling. 32GB RAM ensures smooth multitasking with multiple design applications.',
        'priority': ['Strong single-core performance', 'Dedicated GPU for 3D', 'High RAM capacity']
    },
    {
        'id': 'mechanical_engineer',
        'name': 'Mechanical Engineering Student',
        'keywords': ['mechanical', 'engineer', 'student', 'solidworks', 'catia', 'ansys', 'cad'],
        'hardware': {
            'cpu': ['AMD Ryzen 9 7950X', 'Intel Core i9-13900K'],
            'gpu': ['NVIDIA RTX 4070 Ti', 'NVIDIA RTX 4080'],
            'ram': ['32GB DDR5', '64GB DDR5'],
            'monitor': ['27-inch 4K', 'UltraWide 34-inch'],
            'storage': ['2TB NVMe SSD', '1TB SSD + 2TB HDD']
        },
        'software': ['SolidWorks', 'CATIA', 'ANSYS', 'MATLAB', 'AutoCAD'],
        'description': 'Mechanical engineering requires powerful multi-core CPUs for simulations and dedicated GPUs for CAD. We recommend 32GB or more RAM to handle complex assemblies and finite element analysis.',
        'priority': ['High multi-core performance', 'Professional GPU', 'Large RAM']
    },
    {
        'id': 'gamer',
        'name': 'Gamer',
        'keywords': ['gamer', 'gaming', 'play', 'game', 'esports', 'streamer'],
        'hardware': {
            'cpu': ['AMD Ryzen 7 7800X3D', 'Intel Core i5-13600K'],
            'gpu': ['NVIDIA RTX 4080', 'NVIDIA RTX 4070 Ti', 'AMD RX 7900 XT'],
            'ram': ['32GB DDR5', '16GB DDR4'],
            'monitor': ['27-inch 240Hz', '34-inch Ultrawide 144Hz'],
            'storage': ['2TB NVMe SSD', '1TB SSD + 2TB HDD']
        },
        'software': ['Steam', 'Discord', 'OBS Studio (for streaming)'],
        'description': 'For gamers, the GPU is the most important component. We recommend high-refresh-rate monitors and fast storage to reduce load times. Consider a high-end CPU for competitive titles.',
        'priority': ['High-end GPU', 'High refresh monitor', 'Fast storage']
    },
    {
        'id': 'scientist',
        'name': 'Scientist / Researcher',
        'keywords': ['scientist', 'researcher', 'data science', 'machine learning', 'ai', 'ml', 'simulation', 'matlab'],
        'hardware': {
            'cpu': ['AMD Threadripper 7970X', 'Intel Core i9-14900K'],
            'gpu': ['NVIDIA RTX 4090', 'NVIDIA A6000'],
            'ram': ['64GB DDR5', '128GB DDR5'],
            'monitor': ['4K 32-inch', 'Dual 27-inch 4K'],
            'storage': ['4TB NVMe SSD', '8TB HDD RAID']
        },
        'software': ['MATLAB', 'Python (Anaconda)', 'R', 'TensorFlow', 'PyTorch', 'Simulation software'],
        'description': 'Research workloads often require massive parallel processing. A high-core-count CPU and plenty of RAM are essential. For AI/ML, a powerful GPU accelerates training.',
        'priority': ['High core count', 'Large RAM', 'Fast GPU for compute']
    },
    {
        'id': 'designer',
    'name': 'Graphic Designer / Video Editor',
    'keywords': ['designer', 'graphic design', 'video editor', 'photoshop', 'illustrator', 'premiere', 'after effects', 'editing'],
        'hardware': {
            'cpu': ['Intel Core i7-13700K', 'AMD Ryzen 9 7900X'],
            'gpu': ['NVIDIA RTX 4070', 'NVIDIA RTX 4060 Ti'],
            'ram': ['32GB DDR5', '16GB DDR5'],
            'monitor': ['27-inch 4K color-accurate', 'Dual 27-inch'],
            'storage': ['2TB NVMe SSD', '1TB SSD + 2TB HDD']
        },
        'software': ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe Premiere Pro', 'After Effects', 'Figma', 'Blender'],
        'description': 'Creative work benefits from a color-accurate monitor and a strong GPU for rendering. Fast storage is crucial for large media files.',
        'priority': ['Color-accurate display', 'Strong GPU', 'Fast storage']
    },
    {
        'id': 'general',
        'name': 'General Use',
        'keywords': ['general', 'home', 'office', 'student', 'basic'],
        'hardware': {
            'cpu': ['Intel Core i5-13400', 'AMD Ryzen 5 7600'],
            'gpu': ['Integrated graphics', 'NVIDIA GTX 1650'],
            'ram': ['16GB DDR4', '8GB DDR4'],
            'monitor': ['24-inch 1080p IPS', '22-inch 1080p'],
            'storage': ['512GB NVMe SSD', '1TB HDD']
        },
        'software': ['Microsoft Office', 'Web browsers', 'Basic productivity'],
        'description': 'For everyday tasks like browsing, office work, and media consumption, a balanced mid-range system offers the best value.',
        'priority': ['Value for money', 'Reliability', 'SSD for speed']
    }
]