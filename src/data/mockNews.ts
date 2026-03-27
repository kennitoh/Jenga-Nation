export const mockNews = [
    {
        id: "n1",
        title: "County Launches New Youth Enterprise Fund",
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        category_id: "economic-development"
    },
    {
        id: "n2",
        title: "Health Ministry Announces Free Cholera Vaccination",
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        category_id: "health"
    },
    {
        id: "n3",
        title: "Road Maintenance Scheduled for Thika Superhighway",
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        category_id: "infrastructure"
    },
    {
        id: "n4",
        title: "Education sector receives boost with new textbooks",
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        category_id: "education"
    },
    {
        id: "n5",
        title: "New Digital Innovation Hub Opens in Westlands",
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
        category_id: "digital-technology"
    }
];
