export const galleryItems = [
  { id: 1, title: "Freshers Night", category: "Events ??" },
  { id: 2, title: "Industrial Visit", category: "Trips ??" },
  { id: 3, title: "Hackathon Day", category: "Events ??" },
  { id: 4, title: "Classroom Chaos", category: "Classroom ??" },
  { id: 5, title: "Farewell Stage", category: "Fests ??" },
  { id: 6, title: "Campus Walk", category: "Trips ??" },
  { id: 7, title: "Lab Memories", category: "Classroom ??" },
  { id: 8, title: "Final Presentation", category: "Classroom ??" },
  { id: 9, title: "Annual Day", category: "Events ??" }
].map((item) => ({
  ...item,
  image: `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80&fm=webp&sig=${item.id}`
}));

export const galleryCategories = ["All", "Events ??", "Trips ??", "Classroom ??", "Fests ??"];
