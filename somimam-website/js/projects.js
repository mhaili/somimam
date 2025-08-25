document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const loadMoreBtn = document.getElementById('load-more');
    
    // Projects data (in a real scenario, this would come from an API)
    const allProjects = Array.from(projectCards);
    let visibleProjects = 6; // Number of projects to show initially
    
    // Filter projects
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Reset visible projects counter
            visibleProjects = 6;
            
            // Show/hide projects based on filter
            allProjects.forEach((project, index) => {
                const category = project.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    project.style.display = index < visibleProjects ? 'block' : 'none';
                } else {
                    project.style.display = 'none';
                }
            });
            
            // Show/hide load more button
            updateLoadMoreButton(filter);
        });
    });
    
    // Load more projects
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            const filteredProjects = activeFilter === 'all' 
                ? allProjects 
                : allProjects.filter(project => project.getAttribute('data-category') === activeFilter);
            
            // Show more projects
            const currentlyVisible = document.querySelectorAll(`.project-card[style="display: block;"], .project-card:not([style])`).length;
            const nextVisible = currentlyVisible + 3;
            
            for (let i = currentlyVisible; i < nextVisible && i < filteredProjects.length; i++) {
                if (filteredProjects[i]) {
                    filteredProjects[i].style.display = 'block';
                }
            }
            
            // Hide load more button if all projects are visible
            if (nextVisible >= filteredProjects.length) {
                loadMoreBtn.style.display = 'none';
            }
            
            // Update visible projects counter
            visibleProjects = nextVisible;
        });
    }
    
    // Update load more button visibility
    function updateLoadMoreButton(filter) {
        if (!loadMoreBtn) return;
        
        const filteredProjects = filter === 'all' 
            ? allProjects 
            : allProjects.filter(project => project.getAttribute('data-category') === filter);
        
        if (filteredProjects.length > 6) {
            loadMoreBtn.style.display = 'inline-block';
            
            // Initially show only 6 projects
            filteredProjects.forEach((project, index) => {
                project.style.display = index < 6 ? 'block' : 'none';
            });
        } else {
            loadMoreBtn.style.display = 'none';
            
            // Show all projects if less than 6
            filteredProjects.forEach(project => {
                project.style.display = 'block';
            });
        }
    }
    
    // Initialize
    updateLoadMoreButton('all');
    
    // Add animation to project cards on scroll
    const animateOnScroll = () => {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animation
    const projectCardsAll = document.querySelectorAll('.project-card');
    projectCardsAll.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Trigger initial animation check
    animateOnScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
