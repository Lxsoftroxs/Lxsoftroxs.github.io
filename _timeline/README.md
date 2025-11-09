# Timeline Events

This directory contains your life timeline events. Each event is a markdown file with YAML front matter.

## Creating a New Event

Create a new file with the format: `YYYY-MM-DD-event-slug.md`

### Template

```markdown
---
date: YYYY-MM-DD
title: "Event Title"
summary: "A brief one-sentence summary that appears on the collapsed card"
details: "Longer description with more context, memories, and details. This appears when you click to expand the card."
category: "category-name"
milestone: true/false
people: ["Person 1", "Person 2", "Person 3"]
location: "City, State/Country"
age: 25
notes: "Private notes or context for yourself"
media: ["/assets/images/photo1.jpg", "/assets/images/photo2.jpg"]
connections: ["YYYY-MM-DD-other-event"]
---
```

## Field Descriptions

### Required Fields

- **date**: The date of the event (YYYY-MM-DD format)
- **title**: The name/title of the event
- **summary**: A brief description shown in the collapsed view
- **category**: Category for filtering (see categories below)

### Optional Fields

- **details**: Extended description shown when expanded (supports markdown)
- **milestone**: Set to `true` for major life milestones (shows as red dot instead of cyan)
- **people**: Array of people involved in this event
- **location**: Where this event took place
- **age**: Your age at the time (will be auto-calculated if you set a birthdate)
- **notes**: Personal notes or context (shown in a special note box)
- **media**: Array of image paths to display in a gallery
- **connections**: Array of related event file names (links events together)

## Categories

Choose from these categories for consistent filtering:

- `birth` - Birth and early childhood
- `education` - School, graduation, academic achievements
- `travel` - Trips, moves, adventures
- `achievement` - Awards, accomplishments, proud moments
- `relationship` - Important relationships, friendships, family
- `work` - Jobs, career milestones, internships
- `creative` - Art, music, writing, projects
- `milestone` - Major life events
- `other` - Everything else

## Examples

### Simple Event
```markdown
---
date: 2023-06-15
title: "Graduated college"
summary: "Received my degree after 4 years of hard work"
category: "education"
milestone: true
---
```

### Detailed Event with Media
```markdown
---
date: 2024-07-20
title: "Road trip across America"
summary: "Epic 3-week journey from coast to coast"
details: |
  Started in NYC, drove through the heartland, saw the Grand Canyon,
  and ended up in San Francisco. Changed my perspective on everything.

  Favorite moments:
  - Sunrise at the Grand Canyon
  - Weird roadside attractions in Kansas
  - Meeting random people at diners
category: "travel"
milestone: false
people: ["Best Friend", "College Roommate"]
location: "USA Cross-Country"
age: 24
media:
  - "/assets/images/roadtrip1.jpg"
  - "/assets/images/roadtrip2.jpg"
  - "/assets/images/roadtrip3.jpg"
notes: "This trip was life-changing. Need to do this again."
---
```

### Event with Connections
```markdown
---
date: 2020-03-15
title: "Met my mentor"
summary: "First meeting with someone who would change my career trajectory"
details: "Met at a coffee shop to discuss the industry. Little did I know this person would become one of the most influential people in my life."
category: "relationship"
milestone: true
people: ["Mentor Name"]
location: "Coffee Shop, Brooklyn"
connections: ["2021-06-01-started-new-job", "2022-11-15-promotion"]
---
```

## Tips

1. **Be honest and personal** - This is your story, make it real
2. **Add photos** - Visual memories are powerful
3. **Tag people** - It creates a web of relationships over time
4. **Link events** - Use connections to show how events relate
5. **Use milestones sparingly** - They should be truly significant
6. **Write details for your future self** - You'll forget things, write them down
7. **Don't worry about being comprehensive** - Add events as you remember them

## Timeline Features

- **Search** - Search across titles, summaries, details, locations, and people
- **Filter** - Filter by category
- **Sort** - View oldest-first or newest-first
- **Expand** - Click any event to see full details
- **Interactive** - Click on people tags to search for them

## Adding Photos

1. Add images to `/assets/images/timeline/`
2. Reference them in the `media` field: `["/assets/images/timeline/yourphoto.jpg"]`
3. They'll appear in a grid when the event is expanded

## Getting Started

1. Replace the sample events with your real events
2. Start with major milestones (birth, graduation, moves, etc.)
3. Fill in smaller events as you remember them
4. Add photos and details over time
5. Enjoy watching your life story unfold visually!

---

Remember: This timeline is for YOU. Make it as detailed or minimal as you want. It's your autobiography, your way.
