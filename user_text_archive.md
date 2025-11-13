# User Text Archive

## File: README.md

```
# YO get outta herreeeeee, IM DEBUGGING
```

## File: _comments/2025-10-29-welcome.md

```
---
author: "Lxsoft"
date: 2025-10-29
---

I'm me ofc
```

## File: _comments/README.md

```
# Comments Collection

This directory contains approved community comments that are displayed on the `/comments/` page.

## How It Works

1. Users submit comments through the form at `/comments/`
2. Comments are sent to the Vercel API endpoint: `https://subscriber-api-lolroxs.vercel.app/api/comments`
3. **The API must sanitize and validate all input before creating files**
4. Approved comments are created as markdown files in this directory
5. Jekyll automatically loads them into the `site.comments` collection
6. The comments page displays them in chronological order

## File Format

Each comment file should follow this format:

```markdown
---
author: "Name or Anonymous"
date: YYYY-MM-DD
---

The sanitized comment text goes here.
All HTML, JavaScript, and code must be escaped or removed.
```

## Backend API Requirements

The `/api/comments` endpoint on your Vercel API **MUST**:

### 1. Input Validation
- Validate that `comment` field exists and is not empty
- Limit `name` to 50 characters
- Limit `comment` to 1000 characters
- Reject submissions with URLs if spam is a concern

### 2. Sanitization (CRITICAL for Security)
```javascript
// Example sanitization in Node.js
function sanitizeInput(text) {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#96;')
    .trim();
}
```

### 3. File Creation
- Create a new file in `_comments/` directory
- Filename format: `YYYY-MM-DD-HHmmss.md` (timestamp to ensure uniqueness)
- Use GitHub API to create the file in the repository
- Requires a GitHub Personal Access Token with repo permissions

### 4. GitHub API Integration Example
```javascript
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

await octokit.rest.repos.createOrUpdateFileContents({
  owner: 'Lxsoftroxs',
  repo: 'Lxsoftroxs.github.io',
  path: `_comments/${filename}`,
  message: 'Add new comment',
  content: Buffer.from(fileContent).toString('base64'),
  branch: 'main'
});
```

## Security Measures

### On the Backend (Required):
1. **HTML Escaping**: Convert all `<`, `>`, `"`, `'` characters to HTML entities
2. **Script Removal**: Strip any `<script>` tags or JavaScript
3. **URL Validation**: Optional - block or sanitize URLs to prevent phishing
4. **Rate Limiting**: Implement rate limiting to prevent spam (e.g., 1 comment per IP per minute)
5. **Profanity Filter**: Optional - add a profanity filter
6. **Manual Review**: Consider requiring manual approval before comments go live

### On the Frontend (Already Implemented):
1. Character limits (1000 chars for comment, 50 for name)
2. Honeypot field for bot detection
3. Client-side sanitization (backup, not primary security)
4. Jekyll's `| escape` filter when displaying comments

## Environment Variables Needed

Add to your Vercel project:
- `GITHUB_TOKEN`: Personal Access Token with `repo` scope
- `GITHUB_OWNER`: Lxsoftroxs
- `GITHUB_REPO`: Lxsoftroxs.github.io

## Testing

Create a test comment file manually to verify the display works:

```bash
cat > _comments/2025-10-29-test.md << 'EOF'
---
author: "Test User"
date: 2025-10-29
---

This is a test comment to verify the system works correctly!
EOF
```

Then check the `/comments/` page to see if it displays.

## Moderation

To remove inappropriate comments:
1. Delete the corresponding `.md` file from `_comments/`
2. Commit and push the change
3. GitHub Pages will rebuild without that comment

## Additional Security Notes

- **Never trust user input** - Always sanitize on the backend
- The `| escape` filter in Jekyll helps prevent XSS, but is not sufficient alone
- Consider implementing a profanity filter or spam detection
- Monitor the comments regularly for inappropriate content
- Consider adding reCAPTCHA for additional bot protection
```

## File: _journal/2025-03-29-daily.md

```
---
layout: post
title: ""
date: 2025-03-29
---
What happened on this crazy day—well, as this is my first entry, I want to highlight what I want this to be. I spent several hours yesterday walking in the cold rain, thinking about who I could talk to. An issue I had with my previous girlfriend is that I would censor many parts of my stories to better fit what I wanted her to know. Sometimes she would get more of the full story and get angry at me for not telling the whole truth. I think, similar to the concept of masks, we only show parts of the whole that we are. I restrict the story I tell because I honestly find many of my thoughts and actions to be stupid or gross. Like, no one knew my location after I was kicked out of my friend’s apartment. The closest person I know thought I was in a hotel, and everyone else still thought I was with my friend in his dorm. In reality, I wandered the streets and sat people-watching inside libraries. Everyone in my life would think that to be ill-advised, so I keep the full story to myself. When I make stupid choices and don't tell anyone, it's a gamble that it won't affect anyone else. Only when it grows out of my control does it hurt others.

Now, with that said, I realize the stupidity of it all. It wouldn't get out of my control if I informed others and got help. However, I haven't matured to that point yet. This is one of my steps towards that growth. I want to say more of what I do throughout my day and let the world have access to it. It could limit me—if an ever-present sense of being watched exists, then people tend to do less—but it could also keep me more accountable.

Also, I felt like the posts became more topic-oriented rather than just a journal of sorts. Hopefully they don't interact poorly, where I forget one or the other. This way, I am able to just ramble a little more without as much content awareness and image to keep up.

Okay, with that out of the way, what interesting things have happened today? About 10 minutes ago, I shared a much larger section of the story of my New York trip with a friend. It was freeing because I was able to share more of what I felt versus what I felt I should feel. I think I've spent so much time thinking about improving and being better for people that I've neutered my sense of self. I remember even asking my last girlfriend what I should say to convince her to date me. She replied, of course, "It doesn't matter what I want to hear, it's the person you actually are that I want to hear about" (paraphrased). A flaw with that ideal is there is already an image of who they think I am in their head, and I tend to want to fulfill that, making them think I'm being "real."

The reality of my emotions is that I want to collapse on the floor and cry out, to puke and bask in my sadness. Who the fuck wants to actually walk around in the cold while wet, who wants to sleep on a fucking chair for three nights straight? Fucking no one, but here I sit trying to stay productive even though it's the last thing I want to do.

I've journaled several times throughout my life. The original is a small book I keep in my room. (Notes on that later.) I also kept a digital journal through my first major relationship in high school for 3 months. A lot of the time, it was just a recounting of events. Similarly, I am trying to restart the journaling process because I feel my memory slipping. Even on this trip I just went on, there are few photos I took, and so I strain to piece together every event, and I want to hold the good closely to my heart so that I can remember this trip fondly. So I guess here’s my best recounting of events from start to finish in the most detail possible, mostly just for me. I also don’t really want to include names or minor personal details, but I also want this to be very faithful. I’m actively considering as I type this what I should do. Maybe just the Reddit thing where I give fake names, sure.

Okay—Becca, let's call her. The night mostly begins with my misinterpretation of a text. She said she’d arrive in New York by 2 a.m., believing this to mean that she would be at the hotel we agreed upon by that time. Having already struggled to find the sort of hole-in-the-wall that the hotel was, I made sure to stand out on the street and watch for her to make sure she saw where to go. I made sure to go inside and tell the desk attendant that I was just waiting on a friend. Eventually, I realized she meant she would enter New York by 2 a.m., and she made it to the hotel by maybe 2:45—I don’t clearly remember. In that time, I tried my best to stay warm, and the desk attendant came outside several times to encourage me inside to wait, but I refused. I stood next to a couple smoking weed for most of the time. Arriving finally, she stepped out of an Uber and immediately fell because she got her bag stuck on the seatbelt. Giggling to myself, we exchanged greetings.

(I’m gonna attempt dialogue—maybe it’s not gonna be exact, of course, I’m not perfect.)
“You didn’t see anything,” she said.
“No, of course not. Great first impression though,” I replied.
“It’s been so many years since we’ve seen each other.”
“Agreed.”

We proceeded indoors and I led her up the elevator to the attendant. Helping her check in, I realized she was pretty sick and tired. We dealt with some issues with the insurance fee, or whatever they call it, being overpriced, and how late we were checking in, but it only took them a couple minutes to help set up our room. She proceeded to get the money into her account. I attempted to pay it, but she rejected my advances toward the terminal. This gave me an interesting first understanding of how she felt about money and her friends. Eventually it goes through, and she stumbles into the lounge as I get the room key and the rest of the information. I sit down with her and she begins to talk about how she hasn’t felt that light-headed before. Quickly I’m starting to realize she hasn’t eaten much and the travel was very draining, alongside her throat sickness. Taking things slow, I encourage us up to the room after we talk for a bit—I don’t remember what about, but I do know we talked. After entering the room, I remember she comments on the lack of amenities like a microwave or coffee maker. She then collapses onto the bed. Making me keep the lights off, I also learn that she hates any lights being on or blinds being raised. Having to adapt to being in a dark room for the rest of the trip, I sit on the bedside as she lies there. The original plan was for me to sleep on the ground. I did not think that was necessary, as the bed was pretty large. Without discussing it, I just ended up sleeping in the same bed as her. Laying there with her, we began talking more about the old stories and people from our childhood. This went on until, I think, around 5 a.m., and I got ready for bed, sharing some melatonin with her because I knew at least I wouldn’t be able to sleep—I felt so energized by her presence. Getting very minimal sleep, I mostly just rolled around and honestly tried getting closer to her, as earlier as we talked she’d bring her face so close to mine in the bed. Several times through the night she would shift and look over at me, but I sleep so lightly that whenever she moved I’d glance in her direction and we’d meet eyes for a moment. With the morning rolling around, I think at that point I began to get up and attempt getting her to start getting ready so we could have our days out on the town. The plan was always that I would maybe stay half a day with her, but as things progressed it changed. She refused to move and wanted to sleep the day away. I ended up going out in the morning to get her some medicine for her throat and a snack and drink as well. She is a very picky person, so the choice of Cheez-Its were not in her favor, leaving them to me. I’m not exactly sure what sparked the next step, but we did begin to cuddle, and I resigned to stay in bed with her for the day. By dinner time, both of us became hungry enough to get ourselves together and go out to a local Japanese market. It was close enough that we decided to walk. Following her around, I wanted to let her experience the joy of trying to navigate and plan in such a grand city. After several loop backs, we ended up at the market and began to shop.


Man, halfway through this and I don’t feel like finishing it, although it’ll help retain the memory. I feel like by putting it into words it’s compressing down the emotion and experience. Like none of this really explains the tension and my eventual sinking comfort into her. I loved spending the time with her, even though none of it really went as planned. I was just happy that she was there with me. I’m going to continue, but in less detail, just for myself.

We took a Lyft back and looked over our food at the hotel. We forgot utensils, so she peeled a dragon fruit for the first time and I ate pork katsu with my hands. It was like a little picnic on the floor as we shared little foods. She loves all her fruits and introduced me to mini kiwis, which I didn’t know existed. I think at this point I tried to set up the TV, but it sucked too. So we went to my laptop. She recommended the movie Happiness. As we watched, a line stuck out to me: “I’m not shit, I’m champagne.” We laughed and joked as it went, eventually pausing it as things became more intimate. Then the night progressed into a new day.

The next morning she had more energy and got up a bit earlier. I left to get bagels for us; she wanted an Asiago with butter. I walked through the rain and got my first experience alone back in New York—very pleasant morning. We ate ravenously and then settled back into bed. We stayed there for quite a while and grew more intimate again. Afterwards, it was evening-ish and she was sparking with energy. We got going and took a train to the bookstore and grocery store. I did miss a stop on the way, but it gave her more time to tell stories of her earlier childhood as we walked.

Entering the bookstore, the layout hadn’t changed at all since my last visit, and we explored all the books. She found the cookbooks and children’s books interesting, made fun of my nose on the way, as well as discussing buying the new Diary of a Wimpy Kid. I saw a lot of manga I wanted, but we then descended to the pens and paper. She liked the masks on the wall and wanted one. We also walked through some cute plushes. Leaving there, we entered the grocery store, which to me was the highlight of the trip. I followed her around as I listened to her stories and as we planned how and when we would hang out next in California. Seeing all the food with a new perspective by my side, I was enthralled. After we snuggled for the first time, I would kiss her forehead at any opportunity, and several times through the grocery store I did.

Then she got a smoothie and we headed out. Needing to return our new goodies, we took the train back and dropped off everything. I felt the need to sink back into bed with her, but she was still full of energy and had us go back out to see an Urban Outfitters that was very large. She bought a candle and a new dress. We then sought out a lighter at a local Target, getting to really jaywalk on the way there. With this stuff in hand, we then took a long trip to Coney Island to see if we could ride a Ferris wheel. Sadly, it was closed and the area was kind of sketchy, but we made the most of it by exploring the beach and a little park. She tried to convince me several times to break into an ice cream parlor that was closed. On the way back, we had some deeper talks about family and relationships. I enjoyed holding her hand and listening to her while seeing the city lights pass by.

Arriving back to the hotel, it was pretty late, but we ended up putting on All Hallows’ Eve. The type of movies she’s into are much darker than I’m used to, so I was honestly scared of what would show, but I found the movie pretty comedic. She got a bit spooked and wanted me to stand by the bathroom. We then stopped this movie halfway through too. She was on her period at this point. We headed to sleep from there.

Waking up, she was in the bathroom and she said she was feeling pretty sick. Unknowingly, she was vomiting and suffering pretty badly. When I noticed, I went out to get her some better stuff to help with the pain, and I went further to get higher-quality stuff. Eventually, she made it out fine, but we had to start getting ready to split as we started heading toward the bus location. It was windy and we were hungry, so we stumbled into a Starbucks. She gets a London Fog latte while she’s there. We get to the bus location a bit early, so we sit and talk on some steps for a while. I enjoyed it so much. As we proceed to part ways, she stops me, brings me close, and tells me she loves me and misses me. We kiss, then separate.

Man, that’s so sad, since we aren’t even talking a day after that, but a man can hope that there was worth behind those days. Hoping she’ll remember like I am and think to talk to me again. But I have a flight to catch. You could be reading this—there is a chance, since I gave you access—but all I can say is sorry. Someday I hope to see you again, to try again.





















```

## File: _journal/2025-03-30-daily.md

```
---
layout: post
title: ""
date: 2025-03-30
---
```

## File: _journal/2025-03-31-daily.md

```
---
layout: post
title: ""
date: 2025-03-31
---

Something feels off about myself. Maybe its an oncoming sickness, some sleepdepervation from the last couple days catching up to me, or something more fundamental. Its like an enroching of my mental illness, I can't see as clearly, I feel less happy, I'm more irritable, everything just feels kinda awful. Describing it here I think I really just do need sleep, the stress and worries I have aren't really founded. But here they are anyways. I'm worried I changed in a bad way, everything feels less familiar as I reenter my town. New smells, different faces, but the same boring gross place. Ah nvm it is jsut lack of sleep, im just going to head to bed but I do want to tell one story. On the amtrak back to my town, a random dishelved and sun burnt man sat next to me while we waited for the train to arrive, it was just slightly too closse for comfort. Then when getting on the train he sat next to me again. Smelling heavily of body oder and weed it was very uncomfortable but I did try to empathize. Eventually he asks to make a call on myphone and I tell him of course. He calls his mom and says he's heading home and that hes done traveling the US. Later on he goes and tells me that he had a horrible time and lived on the streets and also got his stuff taken from him. People like to open up to me like this, I keep an open demonour I think and I don't mind listening to anyone but burdening all these stories does pain me. I think that I reminded him of himself when looking at me. I smelled badly too and my facial hair was grown out. I don't want to end up like these people just seeking anyone to talk to but I also feel like thats what I already am. I feel like this blog is sorta turning into a weird spiral downwards. My meds should help and its probably just a temporary sadness thats coming from this trip but I just feel so alienated from myself and I'm in a state of self searching. 
```

## File: _journal/2025-04-01-daily.md

```
---
layout: post
title: ""
date: 2025-04-01
---

So rarely do I let myself get angry but fuck I'm so mad. There's so much I want out of life that I grasp only to let it slip through my fingers, fills me with anger at myself most of all. I need to be be better to do better, so that I can make the most of the little time I get, not for some society reason, I wanna do it for myself but I suck. I will fucking make it, spit on your grave curse your lineage, death to those who oppose me. 
```

## File: _journal/2025-10-05-daily.md

```
---
layout: post
title: ""
date: 2025-10-05
---
As all things start, I need to observe myself. Why did I let it get to this point. Why am I mad at myself for being me. Why am I me. Why do I want to be fingers instead of toes. 
I remember the days my dad would grow angry at me for using spell check, it was a crutch so I wouldn’t have to learn to spell. Feels like we’ve come so far from then, not only is spell check integrated into everything we do, we don’t even have to write for ourselves now. ( the commentary here is that I dont use spell check for these writings )
Ideologically I would use alcohol as a crutch, I get so anxious in crowds that I wanted any way to just enjoy myself, and I took the easy way out. Even in my own state of being that conflicts with my dreams, I love to learn so why haven’t I learned to let go and enjoy myself. I set myself the goal of no longer drinking. 
After a problem is recognized then one can work on solving it or understanding it. Both directions can be traps, one can spend all the time in the world trying to find the why, that they miss the time to change. One can also do everything to solve a problem they dont understand so their work gets them no where. 
I think I’ve spent enough time tearing apart my puzzle and putting it back together that I could do it blind now, I need to add new parts and expand on the person I am. 

With the self reflection out of the way lets talk reality. I fucked up, I let the inside thoughts come to the outside. I didn’t want the thoughts in the first place, I worked on represssing them, but not confronting them. I ran away from them in my own head. Now to put voice to those thoughts once more. On Friday night 10/3/2025, I talked with Peyton, Antoinette, and Beckett while the rest of the party went to smoke. I said I knew things that Peyton and Antoinette might wanna know, even with Becketts warning not to say anything, I pressed on. Having pressured Marlina over text earlier that day to see if she was queer, I displayed the texts to Peyton. Also earlier during the party I asked where Corina had slept the night before knowing full well that she slept in Antoninettes bed. She sat down and told me she had no feelings for Antoinette. I didn’t feel comfortable sharing that with antoinette so I kept it to myself.
Having upset Peyton I tried to remedy the situation I asked Peyton to tell me about herself. The drunk mind makes odd jumps but I thought that if I could get to know her then maybe I could fix things. That didn’t help I was led out of the room by beckett and I was put in bed, I did eventually get up and apologize but it didnt mean much it seemed. Beckett then dragged me back into the room again as Antoinette consoled Peyton. 
I then laid in bed until Jill got home from smoking, she very sweatly took care of me for the rest of the night. I cried and cried. That night she asked me if I would be okay if she could sleep outside the room. I told her yes but also that she could go sleep with Maxwell, and I asked if she wished I were someone else. Thats the night I remember, I worry I did more bad then even I know. 

I want to write my apology to everyone as letters by tomorrow, and to formalize expectations for the relationship through writing and conversation with Jill. 

In the one day since the breakup over that nights events, Ive only begun to understand how much I’ve lost in an instant. 


Jill I dont really know how to begin here. Theres an infinite things to say, theres no amount of apologizing that will solve the problem, theres promises to be made and kept, but a trust that needs to be rebuilt. You know all of that, you know more things then me. Dog that I dont want to be, I should defend myself. I never had any malicious intent, as Hanlons razor says, I made mistakes through my ignorance. 
“Weakness and ignorance are not barriers to survival, but arrogance is.”
― Liu Cixin, Death's End
But my arrogance is where I went wrong, I believed I knew enough to play cupid, I thought my insecurities about maxwell were a reality. It feels like I have to relearn these lessons with each relationship, when will I escape myself. The answer is clear that each time I get a little better, I seek to confront it this time and clearly outline my feelings because I want this between us more then anything. 
Thats my defense, I wanted Peyton to find something with Marlina so the family could grow a little bigger, and I wanted to no longer be afraid of losing you to someone else. I went about those actions in all the worst ways. 
So I seek to stay in the valley of despair, in that hole I can’t find an arrogance to take uninformed action. In order to better I should have remained in my curiosity, watching and learning from a distanc rather then forcing information and change out of people. I need to get to know you more and your relationships with the people around you so I can learn to trust you, rather then assume an unjust truth. 
The worst thing of all here though is that I didn’t take your requests to heart. I was told multiple times not to press on your roomates but I was arrogant enough to believe that I would bring enough good to balance out the rule breaking. Like an animal I circle my boundaries, looking for cracks and to understand the freedom I have been given. In reality tho people build their walls around themselves, in my greed and arrogance I see them as walls surrounding myself. Then again I don’t actually see it that way, I’m not an animal and I’m not a child, I know how to respect people and how to treat others kindly. I make such an effort and yet I let the bad slip through on occasion. I want to reduce the pain it causes and to set up ways to be understood. 

What do I want from a relationship and what do I think I need to do better at to even make it work. I can’t make demands without giving something in return. A two laned road, a dance for two, a duet, to give and receive.
What is a romantic relationship to me? I think its a conversation and intimacy between people that is built on hope. I love my friends and would do things with them and talk to them in such a way it wouldn’t be distinguishable from an actual romantic relationship, but I think what does set them apart is the hope for more. With friends its like a passive love, its not necessarily less but its got less intention behind it. Maybe thats an error in my psyche, when I love someone I become active in how I show it, but that can lead to a pushing force that asks for more. Nonetheless that is how I love as of now, through a hope for more. 
So what makes up that hope? Now the reality sets in, I want to share in almost all aspects of life. Like a combination between souls, I want to share friends, experiences, dreams, worries, and everything else that crosses the mind, within reason ofc. I know that it would be asking too much to demand someones all, so I leave a respect on the table for boundaries to be set. I normally will curiously push on peoples walls, looking to see whats a real wall and whats there just to ward away the undetermined. Through alcohol it seems I lose that softness of touch. 

Thats what I look for when I reach out, someone to share the love with, someone I can share anything with without judgement. There are ways I would like to be respected too. Most of the time I just take the pain of a bad comment towards me, if I can choke it down then I don’t need to risk the chance of upsetting someone or restricting someones sense of freedom when talking with me. The worst things is feeling like you can’t say whats on your mind, walking on eggshells, afraid of retaliation. I know you can sense the fact that sometimes the jokes at my expense make me uncomfortable, I’m not too concerned about voicing that yet, I see an effort to change so I don’t need to ask more of you. 


```

## File: _pages/comments.html

```
---
layout: default
title: "Comments"
permalink: /comments/
---

<h1>Community Comments</h1>

<div class="comments-page">
  <div class="comment-form-container">
    <h2>Submit a Comment</h2>

    <form id="comment-form">
      <div class="form-group">
        <label for="comment-name">Your Name (optional):</label>
        <input
          type="text"
          id="comment-name"
          name="name"
          maxlength="50"
          placeholder="Anonymous"
        />
      </div>

      <div class="form-group">
        <label for="comment-text">Your Message: <span class="required">*</span></label>
        <textarea
          id="comment-text"
          name="comment"
          required
          maxlength="1000"
          rows="6"
          placeholder="Write your message here... (max 1000 characters)"
        ></textarea>
        <div class="char-count">
          <span id="char-count">0</span>/1000 characters
        </div>
      </div>

      <!-- Honeypot field for bot protection -->
      <input type="text" name="website" style="display:none;" tabindex="-1" autocomplete="off" />

      <button type="submit" id="submit-button">Submit Comment</button>
      <div id="form-message" class="form-message"></div>
    </form>
  </div>

  <div class="comments-display">
    <h2>Recent Comments</h2>
    {% if site.comments.size > 0 %}
      <div class="comments-list">
        {% assign sorted_comments = site.comments | sort: 'date' | reverse %}
        {% for comment in sorted_comments limit:20 %}
          <div class="comment-item">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author | default: "Anonymous" }}</span>
              <span class="comment-date">{{ comment.date | date: "%B %d, %Y" }}</span>
            </div>
            <div class="comment-text">
              <!-- Content is already sanitized when created -->
              {{ comment.content | escape }}
            </div>
          </div>
        {% endfor %}
      </div>
    {% else %}
      <p class="no-comments">No comments yet. Be the first to share your thoughts!</p>
    {% endif %}
  </div>
</div>

<style>
.comments-page {
  max-width: 800px;
  margin: 0 auto;
}

.comment-form-container {
  background: rgba(255, 255, 255, 0.03);
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 3rem;
  border: 1px solid rgba(109, 221, 255, 0.2);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #6df;
}

.required {
  color: #ff6b6b;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(109, 221, 255, 0.3);
  border-radius: 4px;
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.char-count {
  text-align: right;
  font-size: 0.875rem;
  color: #888;
  margin-top: 0.25rem;
}

#submit-button {
  background: #6df;
  color: #111;
  border: none;
  padding: 0.75rem 2rem;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

#submit-button:hover {
  background: #5ce;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(109, 221, 255, 0.3);
}

#submit-button:disabled {
  background: #555;
  cursor: not-allowed;
  transform: none;
}

.form-message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  display: none;
}

.form-message.success {
  display: block;
  background: rgba(72, 187, 120, 0.2);
  border: 1px solid #48bb78;
  color: #48bb78;
}

.form-message.error {
  display: block;
  background: rgba(245, 101, 101, 0.2);
  border: 1px solid #f56565;
  color: #f56565;
}

.security-notice {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(109, 221, 255, 0.1);
  border-left: 3px solid #6df;
  border-radius: 4px;
}

.security-notice h3 {
  margin-top: 0;
  color: #6df;
}

.security-notice ul {
  margin-bottom: 0;
}

.comments-display {
  margin-top: 3rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(109, 221, 255, 0.2);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(109, 221, 255, 0.2);
}

.comment-author {
  color: #6df;
  font-weight: bold;
}

.comment-date {
  color: #888;
  font-size: 0.875rem;
}

.comment-text {
  color: #ddd;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.no-comments {
  text-align: center;
  color: #888;
  font-style: italic;
  padding: 2rem;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('comment-form');
  const submitButton = document.getElementById('submit-button');
  const formMessage = document.getElementById('form-message');
  const commentText = document.getElementById('comment-text');
  const charCount = document.getElementById('char-count');

  // Character counter
  commentText.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = length;

    if (length >= 1000) {
      charCount.style.color = '#ff6b6b';
    } else if (length >= 800) {
      charCount.style.color = '#ffa500';
    } else {
      charCount.style.color = '#888';
    }
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Check honeypot
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
      // Bot detected, silently fail
      showMessage('Thank you for your submission!', 'success');
      form.reset();
      return;
    }

    const name = document.getElementById('comment-name').value.trim();
    const comment = commentText.value.trim();

    if (!comment) {
      showMessage('Please enter a message.', 'error');
      return;
    }

    // Basic sanitization on client side (backend must also sanitize!)
    const sanitizedName = sanitizeInput(name || 'Anonymous');
    const sanitizedComment = sanitizeInput(comment);

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    formMessage.style.display = 'none';

    try {
      // Submit to API endpoint
      const response = await fetch('https://subscriber-api-lolroxs.vercel.app/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sanitizedName,
          comment: sanitizedComment,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        showMessage('Thank you! Your comment has been submitted and will appear after review.', 'success');
        form.reset();
        charCount.textContent = '0';
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      showMessage('Sorry, there was an error submitting your comment. Please try again later.', 'error');
      console.error('Submission error:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Comment';
    }
  });

  function sanitizeInput(str) {
    // Remove any HTML tags and dangerous characters
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .substring(0, 1000); // Enforce max length
  }

  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 5000);
    }
  }
});
</script>
```

## File: _pages/diary.html

```
---
layout: default
title: "Diary"
permalink: /diary/
---

<div class="diary-page">
  <h1 class="diary-title">Diary Photos</h1>

  <div class="diary-gallery">
    {% assign photos = site.data.diary_photos %}
    {% for p in photos %}
    <figure class="polaroid" data-id="{{ p.id }}">
      <img src="{{ p.src }}" alt="{{ p.caption }}" loading="lazy" decoding="async">
      <figcaption>{{ p.caption }}</figcaption>
      <button class="like" type="button">❤ <span class="count">0</span></button>
    </figure>
    {% endfor %}
  </div>
</div>

<script src="{{ '/assets/js/diary.js' | relative_url }}"></script>
```

## File: _pages/gallery.html

```
---
layout: default
title: "Photo Gallery"
permalink: /gallery/
---
<h1>Photo Gallery</h1>
<p>Welcome to my gallery.</p>

<div class="gallery">
  {% assign gallery_images = site.static_files | where_exp:"file", "file.path contains '/assets/images/gallery'" %}
  {% for image in gallery_images %}
    {% if image.path contains '.jpg' or image.path contains '.png' or image.path contains '.gif' %}
      <figure>
        <img src="{{ image.path | relative_url }}" alt="{{ image.name }}" loading="lazy" decoding="async">
        <figcaption>{{ image.name }}</figcaption>
      </figure>
    {% endif %}
  {% endfor %}
</div>
```

## File: _pages/journal.html

```
---
layout: default
title: "Daily Journal"
permalink: /journal/
---
<h1>Daily Journal</h1>

<!-- Month Navigation Controls -->
<div id="calendar-controls" style="text-align:center; margin-bottom:10px;">
  <button id="prev-month">Previous Month</button>
  <span id="month-display" style="margin: 0 15px; font-weight:bold;"></span>
  <button id="next-month">Next Month</button>
</div>

<div id="calendar"></div>

<script>
  // Build an array of journal entries from your _journal collection using Liquid.
  // Each entry includes its date (formatted as YYYY-MM-DD), title, and URL.
  var journalEntries = [
  {% for entry in site.journal %}
    {
      "date": "{{ entry.date | date: '%Y-%m-%d' }}",
      "title": "{{ entry.title | escape }}",
      "url": "{{ entry.url | relative_url }}"
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
  ];

  // Global variables for current displayed month (0-indexed) and year.
  var today = new Date();
  var currentYear = today.getFullYear();
  var currentMonth = today.getMonth();

  // Build a calendar for a given year and month.
  function buildCalendar(year, month) {
    var calendarDiv = document.getElementById('calendar');
    calendarDiv.innerHTML = ''; // Clear previous calendar.
    var table = document.createElement('table');
    table.style.margin = '0 auto';
    table.style.borderCollapse = 'collapse';
    table.style.width = '80%';
    table.style.maxWidth = '600px';

    // Days of the week header.
    var daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var headerRow = document.createElement('tr');
    daysOfWeek.forEach(function(day) {
      var th = document.createElement('th');
      th.textContent = day;
      th.style.border = '1px solid #666';
      th.style.padding = '5px';
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Update the month display.
    var monthDisplay = document.getElementById('month-display');
    var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    monthDisplay.textContent = monthNames[month] + ' ' + year;

    // Determine first day and number of days in the month.
    var firstDay = new Date(year, month, 1);
    var startingDay = firstDay.getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var date = 1;

    // Create 6 rows (weeks) in the calendar.
    for (var i = 0; i < 6; i++) {
      var row = document.createElement('tr');
      for (var j = 0; j < 7; j++) {
        var cell = document.createElement('td');
        cell.style.border = '1px solid #666';
        cell.style.padding = '10px';
        cell.style.textAlign = 'center';
        if (i === 0 && j < startingDay) {
          cell.textContent = '';
        } else if (date > daysInMonth) {
          cell.textContent = '';
        } else {
          cell.textContent = date;
          var cellDate = year + '-' + (month + 1).toString().padStart(2, '0') + '-' + date.toString().padStart(2, '0');
          // Check if there's a journal entry for this date.
          var entry = journalEntries.find(e => e.date === cellDate);
          if (entry) {
            cell.style.backgroundColor = '#444';
            cell.style.cursor = 'pointer';
            cell.title = entry.title;
            // On click, redirect to the entry's page.
            cell.addEventListener('click', (function(entryCopy) {
              return function(e) {
                window.location.href = entryCopy.url;
              };
            })(entry));
          }
          date++;
        }
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    calendarDiv.appendChild(table);
  }

  // Event listeners for previous and next month buttons.
  document.getElementById('prev-month').addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    buildCalendar(currentYear, currentMonth);
  });
  document.getElementById('next-month').addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    buildCalendar(currentYear, currentMonth);
  });

  // Initially build the calendar for the current month.
  buildCalendar(currentYear, currentMonth);
</script>
```

## File: _pages/listening.html

```
---
layout: default
title: Listening
permalink: /listening/
---

<style>
  /* light CSS that plays nice with your dark styles */
  .listen-wrap { max-width: 820px; margin: 0 auto; padding: 1rem; }
  .listen-row { display:flex; align-items:center; gap:1rem; padding:.75rem 0; border-bottom:1px solid #333; }
  .listen-row img { width:64px; height:64px; object-fit:cover; border-radius:8px; }
  .listen-meta { font-size:.9rem; opacity:.8; }
  .badge { font-size:.8rem; padding:.15rem .5rem; border-radius:.5rem; border:1px solid #3a3a3a; }
</style>

<div class="listen-wrap">
  <h1>🎧 Listening</h1>
  <p class="listen-meta">Live from Last.fm &mdash; shows “Now Playing” if you’re currently listening.</p>

  <div id="now-playing" class="listen-row" style="display:none;"></div>
  <div id="recent-list"></div>
</div>

<script>
  // 👉 EDIT THESE:
  const LASTFM_USER = "Lxsoft";
  const LASTFM_API_KEY = "01f055a2397afef55e6bef6e3d684510";

  // Tweakable:
  const LIMIT = 50;               // how many recent tracks to show
  const REFRESH_MS = 60_000;      // refresh every 60s
  const SIZE_INDEX = 3;           // 0..3 (bigger album image if available)

  const $now = document.getElementById("now-playing");
  const $list = document.getElementById("recent-list");

  function imgOf(track) {
    const images = track.image || [];
    const pick = images[Math.min(SIZE_INDEX, images.length - 1)];
    return (pick && pick["#text"]) || "https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png";
  }

  function whenText(track) {
    if (track["@attr"] && track["@attr"].nowplaying) return `<span class="badge">Now Playing</span>`;
    const uts = track.date?.uts ? parseInt(track.date.uts, 10)*1000 : null;
    if (!uts) return "";
    const d = new Date(uts);
    return d.toLocaleString();
  }

  function rowHTML(track) {
    const artist = track.artist?.["#text"] || "";
    const title  = track.name || "";
    const url    = track.url || "#";
    return `
      <div class="listen-row">
        <img alt="album art" src="${imgOf(track)}">
        <div>
          <div><a href="${url}" target="_blank" rel="noopener"><b>${title}</b></a></div>
          <div class="listen-meta">${artist}</div>
          <div class="listen-meta">${whenText(track)}</div>
        </div>
      </div>
    `;
  }

  async function loadRecent() {
    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(LASTFM_USER)}&api_key=${LASTFM_API_KEY}&format=json&limit=${LIMIT}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      const tracks = data?.recenttracks?.track || [];

      // Now playing (if present, it’s always the first item with @attr.nowplaying === "true")
      const np = tracks.find(t => t["@attr"] && t["@attr"].nowplaying);
      if (np) {
        $now.style.display = "";
        $now.innerHTML = rowHTML(np);
      } else {
        $now.style.display = "none";
      }

      // Recent (exclude now playing duplicate)
      const recent = tracks.filter(t => !(t["@attr"] && t["@attr"].nowplaying));
      $list.innerHTML = recent.map(rowHTML).join("");
    } catch (e) {
      console.error(e);
      $now.style.display = "";
      $now.innerHTML = `<div>Couldn’t load Last.fm feed.</div>`;
    }
  }

  loadRecent();
  setInterval(loadRecent, REFRESH_MS);
</script>
```

## File: _pages/patrons.html

```
---
layout: default
title: "Patron Wishlist"
permalink: /patrons/
---

<h1>Patron Wishlist</h1>
<p>Here are some cool trinkets I’d love to have. Check out my wishlist below:</p>

<iframe 
  src="{{ '/assets/Comprehensive_Wishlist.pdf' | relative_url }}" 
  width="100%" 
  height="600px" 
  style="border: none;">
  This browser does not support PDFs. Please download the PDF to view it: 
  <a href="{{ '/assets/Comprehensive_Wishlist.pdf' | relative_url }}">Download PDF</a>.
</iframe>
```

## File: _pages/poetry.html

```
---
layout: default
title: "Poetry Collection"
permalink: /poetry/
---

<h1>Poetry Collection</h1>

<ul class="poetry-list">
  {% for poem in site.poetry %}
    <li>
      <a href="{{ poem.url }}">{{ poem.title }}</a><span class="date">{{ poem.date | date: "%B %-d, %Y" }}</span>
    </li>
  {% endfor %}
</ul>
```

## File: _pages/projects.html

```
---
layout: default
title: "Projects"
permalink: /projects/
---
<h1>Projects</h1>
<ul class="projects-list">
  {% for project in site.projects %}
    <li>
      <a href="{{ project.url }}">
        <strong>{{ project.title }}</strong>
      </a>
      {% if project.description %}
        <p>{{ project.description }}</p>
      {% endif %}
    </li>
  {% endfor %}
</ul>
```

## File: _pages/quotes.md

```
---
layout: post
title: Quotes
date: 2025-10-18
permalink: /quotes/
---

"If you had no bad luck, you would have no luck at all"                                  
— My mother


“The universe is a machine for the making of Gods.”  
— Henri Bergson


“My affections and wishes have not changed, but one word from you will silence me forever. If, however, your feelings have changed, I will have to tell you: you have bewitched me, body and soul, and I love--I love--I love you. I never wish to be parted from you from this day on.”            
— Jane Austen, Pride and Prejudice


“In the moment when I truly understand my enemy, understand him well enough to defeat him, then in that very moment I also love him. I think it’s impossible to really understand somebody, what they want, what they believe, and not love them the way they love themselves.”                  
— Orson Scott Card


"I am the beast I worship"                           
— Death Grips


"'We're all dreaming, aren't we?' she says.                                          
All of us are dreaming.                         
'Why did you have to die?'                    
"'I couldn't help it,' you reply."             
— Haruki Murakami


"What won't come off in the sink, won't come off in your food"                        
— Unknown 


"I’m a simple man without a lot of complicated twists and turns. Look down my throat and you can see out my ass"            
— Liu Cixin
```

## File: _pages/timeline.html

```
---
layout: default
title: "Life Timeline"
permalink: /timeline/
---

<style>
/* Timeline specific styles */
.timeline-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #6df;
}

.timeline-header h1 {
  color: #6df;
  text-shadow: 0 0 10px rgba(102, 221, 255, 0.5);
  margin-bottom: 10px;
  font-size: 2.5em;
}

.timeline-subtitle {
  color: #999;
  font-style: italic;
  font-size: 1.1em;
}

/* Controls and filters */
.timeline-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid #333;
}

.timeline-controls input,
.timeline-controls select,
.timeline-controls button {
  padding: 10px 15px;
  background: #222;
  border: 1px solid #6df;
  color: #ddd;
  border-radius: 5px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9em;
  transition: all 0.3s ease;
}

.timeline-controls input:focus,
.timeline-controls select:focus {
  outline: none;
  border-color: #6df;
  box-shadow: 0 0 10px rgba(102, 221, 255, 0.3);
}

.timeline-controls button {
  cursor: pointer;
  background: #333;
}

.timeline-controls button:hover {
  background: #6df;
  color: #111;
  transform: translateY(-2px);
}

.timeline-controls button.active {
  background: #6df;
  color: #111;
}

/* Search bar */
.search-container {
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.search-container input {
  width: 100%;
}

/* Timeline container */
.timeline-container {
  position: relative;
  padding: 20px 0;
}

/* Vertical line */
.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg,
    transparent 0%,
    #6df 10%,
    #6df 90%,
    transparent 100%);
  box-shadow: 0 0 20px rgba(102, 221, 255, 0.5);
  transform: translateX(-50%);
}

/* Timeline item */
.timeline-item {
  position: relative;
  margin-bottom: 30px; /* Minimum spacing, will be overridden dynamically */
  opacity: 0;
  animation: fadeIn 0.6s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.timeline-item.left .timeline-content {
  margin-right: 55%;
  text-align: right;
}

.timeline-item.right .timeline-content {
  margin-left: 55%;
  text-align: left;
}

/* Timeline dot */
.timeline-dot {
  position: absolute;
  left: 50%;
  top: 20px;
  width: 20px;
  height: 20px;
  background: #6df;
  border: 4px solid #111;
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 20px rgba(102, 221, 255, 0.8);
  z-index: 10;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-dot:hover {
  transform: translateX(-50%) scale(1.3);
  box-shadow: 0 0 30px rgba(102, 221, 255, 1);
}

.timeline-dot.milestone {
  width: 30px;
  height: 30px;
  background: #ff6b6b;
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.8);
}

.timeline-dot.milestone:hover {
  transform: translateX(-50%) scale(1.3);
  box-shadow: 0 0 30px rgba(255, 107, 107, 1);
}

/* Timeline content */
.timeline-content {
  background: rgba(26, 26, 26, 0.95);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #333;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
}

.timeline-content:hover {
  border-color: #6df;
  box-shadow: 0 0 30px rgba(102, 221, 255, 0.3);
  transform: translateY(-5px);
}

.timeline-content.expanded {
  border-color: #6df;
  background: rgba(26, 26, 26, 1);
}

/* Date badge */
.timeline-date {
  display: inline-block;
  background: #6df;
  color: #111;
  padding: 5px 12px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 0.85em;
  margin-bottom: 10px;
}

.timeline-item.left .timeline-date {
  float: right;
}

.timeline-item.right .timeline-date {
  float: left;
}

/* Category badge */
.timeline-category {
  display: inline-block;
  background: #333;
  color: #6df;
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 0.75em;
  margin-left: 5px;
  border: 1px solid #6df;
}

/* Age badge */
.timeline-age {
  display: inline-block;
  background: rgba(102, 221, 255, 0.2);
  color: #6df;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 0.7em;
  margin-left: 5px;
}

/* Title */
.timeline-title {
  color: #6df;
  font-size: 1.3em;
  margin: 10px 0;
  clear: both;
}

/* Summary */
.timeline-summary {
  color: #ddd;
  line-height: 1.6;
  margin: 10px 0;
}

/* Expanded details */
.timeline-details {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease;
  color: #bbb;
  line-height: 1.8;
}

.timeline-content.expanded .timeline-details {
  max-height: 2000px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #333;
}

/* People tags */
.timeline-people {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.timeline-people::before {
  content: "👥 ";
  color: #6df;
}

.person-tag {
  background: rgba(102, 221, 255, 0.1);
  color: #6df;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 0.8em;
  border: 1px solid rgba(102, 221, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.person-tag:hover {
  background: rgba(102, 221, 255, 0.3);
  transform: translateY(-2px);
}

/* Media gallery */
.timeline-media {
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.timeline-media img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  border: 2px solid #333;
  transition: all 0.3s ease;
  cursor: pointer;
}

.timeline-media img:hover {
  border-color: #6df;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(102, 221, 255, 0.5);
}

/* Notes */
.timeline-notes {
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-left: 3px solid #6df;
  margin-top: 10px;
  border-radius: 3px;
  font-style: italic;
  color: #999;
}

.timeline-notes::before {
  content: "📝 Note: ";
  color: #6df;
  font-weight: bold;
}

/* Connections */
.timeline-connections {
  margin-top: 10px;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 5px;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.timeline-connections::before {
  content: "🔗 Connected to: ";
  color: #ff6b6b;
  font-weight: bold;
}

/* Mobile responsive */
@media (max-width: 700px) {
  .timeline-line {
    left: 30px;
  }

  .timeline-item.left .timeline-content,
  .timeline-item.right .timeline-content {
    margin-left: 60px;
    margin-right: 0;
    text-align: left;
  }

  .timeline-dot {
    left: 30px;
  }

  .timeline-dot:hover {
    transform: translate(-50%, 0) scale(1.3);
  }

  .timeline-dot.milestone:hover {
    transform: translate(-50%, 0) scale(1.3);
  }

  .timeline-item.left .timeline-date {
    float: left;
  }

  .timeline-controls {
    flex-direction: column;
  }

  .search-container {
    max-width: 100%;
  }
}

/* Empty state */
.timeline-empty {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.2em;
}

.timeline-empty::before {
  content: "🔍";
  display: block;
  font-size: 4em;
  margin-bottom: 20px;
  opacity: 0.3;
}

/* Loading animation */
.timeline-loading {
  text-align: center;
  padding: 40px;
  color: #6df;
}

.timeline-loading::after {
  content: "...";
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0%, 20% { content: "."; }
  40% { content: ".."; }
  60%, 100% { content: "..."; }
}

/* Stats bar */
.timeline-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid #333;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2em;
  color: #6df;
  font-weight: bold;
}

.stat-label {
  display: block;
  font-size: 0.8em;
  color: #999;
  margin-top: 5px;
}
</style>

<div class="timeline-header">
  <h1>✨ Life Timeline ✨</h1>
  <p class="timeline-subtitle">A journey through time, memories, and moments that shaped me</p>
</div>

<!-- Stats -->
<div class="timeline-stats">
  <div class="stat-item">
    <span class="stat-value" id="total-events">0</span>
    <span class="stat-label">Total Events</span>
  </div>
  <div class="stat-item">
    <span class="stat-value" id="years-span">0</span>
    <span class="stat-label">Years Documented</span>
  </div>
  <div class="stat-item">
    <span class="stat-value" id="milestones-count">0</span>
    <span class="stat-label">Milestones</span>
  </div>
</div>

<!-- Controls -->
<div class="timeline-controls">
  <div class="search-container">
    <input type="text" id="timeline-search" placeholder="🔍 Search events, people, places...">
  </div>

  <select id="category-filter">
    <option value="all">All Categories</option>
    <option value="birth">Birth & Early Years</option>
    <option value="education">Education</option>
    <option value="travel">Travel</option>
    <option value="achievement">Achievement</option>
    <option value="relationship">Relationships</option>
    <option value="work">Work & Career</option>
    <option value="creative">Creative Projects</option>
    <option value="milestone">Major Milestones</option>
    <option value="other">Other</option>
  </select>

  <button id="sort-asc" class="active">Oldest First</button>
  <button id="sort-desc">Newest First</button>
  <button id="show-all">Show All</button>
</div>

<!-- Timeline -->
<div class="timeline-container">
  <div class="timeline-line"></div>
  <div id="timeline-events"></div>
</div>

<script>
// Timeline data from Jekyll collection
var timelineData = [
{% for event in site.timeline %}
  {
    "id": "{{ forloop.index }}",
    "date": "{{ event.date | date: '%Y-%m-%d' }}",
    "title": "{{ event.title | escape }}",
    "summary": "{{ event.summary | escape }}",
    "details": {{ event.details | jsonify }},
    "category": "{{ event.category }}",
    "milestone": {{ event.milestone | default: false }},
    "people": {{ event.people | jsonify | default: '[]' }},
    "location": "{{ event.location | escape }}",
    "media": {{ event.media | jsonify | default: '[]' }},
    "notes": "{{ event.notes | escape }}",
    "connections": {{ event.connections | jsonify | default: '[]' }},
    "age": "{{ event.age }}"
  }{% unless forloop.last %},{% endunless %}
{% endfor %}
];

// Calculate age from birthdate if provided
function calculateAge(birthDate, eventDate) {
  // Parse as local dates to avoid timezone issues
  const birthParts = birthDate.split('-');
  const birth = new Date(birthParts[0], birthParts[1] - 1, birthParts[2]);
  const eventParts = eventDate.split('-');
  const event = new Date(eventParts[0], eventParts[1] - 1, eventParts[2]);
  let age = event.getFullYear() - birth.getFullYear();
  const m = event.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && event.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Sort events by date
function sortEvents(ascending = true) {
  return timelineData.sort((a, b) => {
    // Parse as local dates to avoid timezone issues
    const partsA = a.date.split('-');
    const dateA = new Date(partsA[0], partsA[1] - 1, partsA[2]);
    const partsB = b.date.split('-');
    const dateB = new Date(partsB[0], partsB[1] - 1, partsB[2]);
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

// Filter events
function filterEvents(searchTerm, category) {
  let filtered = timelineData;

  if (category !== 'all') {
    filtered = filtered.filter(e => e.category === category);
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(e =>
      e.title.toLowerCase().includes(term) ||
      e.summary.toLowerCase().includes(term) ||
      (e.details && e.details.toLowerCase().includes(term)) ||
      (e.location && e.location.toLowerCase().includes(term)) ||
      (e.people && e.people.some(p => p.toLowerCase().includes(term)))
    );
  }

  return filtered;
}

// Calculate dynamic spacing based on date differences
function calculateSpacing(currentDate, nextDate) {
  if (!nextDate) return 30; // Last item uses minimum spacing

  // Parse dates as local dates to avoid timezone issues
  const currentParts = currentDate.split('-');
  const current = new Date(currentParts[0], currentParts[1] - 1, currentParts[2]);
  const nextParts = nextDate.split('-');
  const next = new Date(nextParts[0], nextParts[1] - 1, nextParts[2]);

  // Calculate difference in days
  const diffTime = Math.abs(next - current);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Spacing configuration
  const MIN_SPACING = 30;    // Minimum spacing in pixels
  const MAX_SPACING = 300;   // Maximum spacing in pixels
  const SCALE_FACTOR = 0.5;  // Pixels per day (adjust for desired sensitivity)

  // Calculate spacing with logarithmic scaling for better visual distribution
  // This prevents very old events from being too far apart
  let spacing = MIN_SPACING + Math.log(diffDays + 1) * 30 * SCALE_FACTOR;

  // Alternative: linear scaling (uncomment to use instead)
  let spacing = MIN_SPACING + (diffDays * SCALE_FACTOR);

  // Clamp between min and max
  spacing = Math.max(MIN_SPACING, Math.min(MAX_SPACING, spacing));

  return Math.round(spacing);
}

// Render timeline
function renderTimeline(events) {
  const container = document.getElementById('timeline-events');
  container.innerHTML = '';

  if (events.length === 0) {
    container.innerHTML = '<div class="timeline-empty">No events found matching your criteria</div>';
    return;
  }

  events.forEach((event, index) => {
    const item = document.createElement('div');
    item.className = `timeline-item ${index % 2 === 0 ? 'left' : 'right'}`;
    item.style.animationDelay = `${index * 0.1}s`;

    // Apply dynamic spacing based on date difference to next event
    const nextEvent = events[index + 1];
    const spacing = calculateSpacing(event.date, nextEvent ? nextEvent.date : null);
    item.style.marginBottom = `${spacing}px`;

    const dot = document.createElement('div');
    dot.className = `timeline-dot ${event.milestone ? 'milestone' : ''}`;

    const content = document.createElement('div');
    content.className = 'timeline-content';

    // Format date (parse as local date to avoid timezone issues)
    const dateParts = event.date.split('-');
    const eventDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    const dateStr = eventDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    let html = `
      <div class="timeline-date">${dateStr}</div>
      <span class="timeline-category">${event.category}</span>
      ${event.age ? `<span class="timeline-age">Age ${event.age}</span>` : ''}
      <h3 class="timeline-title">${event.title}</h3>
      <div class="timeline-summary">${event.summary}</div>
    `;

    // Details (hidden initially)
    if (event.details) {
      html += `<div class="timeline-details">${event.details}</div>`;
    }

    // People
    if (event.people && event.people.length > 0) {
      html += '<div class="timeline-people">';
      event.people.forEach(person => {
        html += `<span class="person-tag">${person}</span>`;
      });
      html += '</div>';
    }

    // Media
    if (event.media && event.media.length > 0) {
      html += '<div class="timeline-media">';
      event.media.forEach(img => {
        html += `<img src="${img}" alt="Memory" loading="lazy">`;
      });
      html += '</div>';
    }

    // Notes
    if (event.notes) {
      html += `<div class="timeline-notes">${event.notes}</div>`;
    }

    // Connections
    if (event.connections && event.connections.length > 0) {
      html += `<div class="timeline-connections">${event.connections.join(', ')}</div>`;
    }

    content.innerHTML = html;

    // Toggle expand on click
    content.addEventListener('click', function() {
      this.classList.toggle('expanded');
    });

    item.appendChild(dot);
    item.appendChild(content);
    container.appendChild(item);
  });
}

// Update stats
function updateStats(events) {
  document.getElementById('total-events').textContent = events.length;

  if (events.length > 0) {
    // Parse as local dates to avoid timezone issues
    const dates = events.map(e => {
      const parts = e.date.split('-');
      return new Date(parts[0], parts[1] - 1, parts[2]);
    });
    const minYear = Math.min(...dates.map(d => d.getFullYear()));
    const maxYear = Math.max(...dates.map(d => d.getFullYear()));
    document.getElementById('years-span').textContent = maxYear - minYear + 1;
  }

  const milestones = events.filter(e => e.milestone).length;
  document.getElementById('milestones-count').textContent = milestones;
}

// Event listeners
document.getElementById('timeline-search').addEventListener('input', function() {
  const searchTerm = this.value;
  const category = document.getElementById('category-filter').value;
  const filtered = filterEvents(searchTerm, category);
  renderTimeline(filtered);
  updateStats(filtered);
});

document.getElementById('category-filter').addEventListener('change', function() {
  const searchTerm = document.getElementById('timeline-search').value;
  const filtered = filterEvents(searchTerm, this.value);
  renderTimeline(filtered);
  updateStats(filtered);
});

document.getElementById('sort-asc').addEventListener('click', function() {
  document.getElementById('sort-asc').classList.add('active');
  document.getElementById('sort-desc').classList.remove('active');
  const sorted = sortEvents(true);
  const searchTerm = document.getElementById('timeline-search').value;
  const category = document.getElementById('category-filter').value;
  const filtered = filterEvents(searchTerm, category);
  renderTimeline(filtered);
});

document.getElementById('sort-desc').addEventListener('click', function() {
  document.getElementById('sort-desc').classList.add('active');
  document.getElementById('sort-asc').classList.remove('active');
  const sorted = sortEvents(false);
  const searchTerm = document.getElementById('timeline-search').value;
  const category = document.getElementById('category-filter').value;
  const filtered = filterEvents(searchTerm, category);
  renderTimeline(filtered);
});

document.getElementById('show-all').addEventListener('click', function() {
  document.getElementById('timeline-search').value = '';
  document.getElementById('category-filter').value = 'all';
  renderTimeline(timelineData);
  updateStats(timelineData);
});

// Initial render
const sortedData = sortEvents(true);
renderTimeline(sortedData);
updateStats(sortedData);
</script>
```

## File: _poetry/fifth-poem.md

```
---
layout: post
title: "Sandals"
date: 2025-04-11
---

Sandals that have never seen the beach
A convience, a freedom of air, yet the sandals don't get to see the sand
```

## File: _poetry/first-poem.md

```
---
layout: post
title: "God Hand"
date: 2025-03-15
---

Liquid seeping out of the hands I call tools, shaking and stuttering they were made for destruction, I see the rust corrode my ornamental knife from the appreciation of my slimy hands. Cursed to describe faults in the details, the precise things in my life breakdown because my hands can't keep them together. Hands made for destruction 
```

## File: _poetry/fourth-poem.md

```
---
layout: post
title: "Home"
date: 2023-07-20
---

I wanna go home  
Dream of such a reality that I mutter about a place that I need to be   
What stops me? What holds me back? Is it even possible to leave  
The cycle continues further and further into the dust I call dreams  
```

## File: _poetry/second-poem.md

```
---
layout: post
title: "The Train"
date: 2025-03-15
---

I sat across from him, as we both carried backpacks from our worlds apart. I knew I couldn't speak his language but I was so curious as to what he knew. After long days the seats on the train were a moment of respite, a way to progress while resting. So as the effects of the day settled throughout the mind and body, his eyes began to droop. However, a curiosity between the both of us kept our eyes interlocked. What was the other thinking and why were they so persistent about looking into my eyes. I will never know what was on his mind but I wanted to know. I began writing in a journal to show him something that maybe he would understand. Students share the common language of math, units may change but numbers are universal. I began to compose equations, simple but progressing in difficulty. Not much can be learned from sharing solved equations but I craved anything, so I persisted in light of wanting to know by the age I assumed he was, what his math level would. I curse myself for never handing him the journal to speak back to me, and yet I think he deserved his sleep.
```

## File: _poetry/third-poem.md

```
---
layout: post
title: "A photo"
date: 2023-12-23
---

There is no real happiness, as the snow cascaded  
Only dreams, the lights hummed yellow  
Today I held a dream, burning cold  
Laying on that snow staring at the sky  
I held a dream  
She laughed, and we walked to the car  
```

## File: _posts/2025-03-15-first-post.md

```
---
layout: post
title: "Hello World"
date: 2025-03-15
---
We in this bitch.

Fuck its taken me long enough to figrue this out. Went through several iterations where I first wanted to run the blog locally on a raspberry pi but no matter what I do there will always be issues with my damn wifi and trying to port forward. So I gave up on that and tried running it on my laptop which taught me a lot but it couldn't be a server because it wasn't always hooked up to the internet. Finally caving I resorted to just trying to get it running on my main pc even though I did not want to leave it on 24/7. That eventually failed too becasue I counldn't replace my router without it breaking the system. So if you've put it together this is the final rendition and it had to be hosted under github. Less as self sustaining as my own server so it could be taken down or whatever but if I wanted complete power then itd be hosted throught the Tor network and you can't just pull that up on your phone to read. 

Anyways here we are now and its a Saturday and the day after Midterm week. I basically bombed both of my midterms but the averages were bellow 80 so I dont feel too hurt about it. I do need to do a little better to pass with a C though cause math teachers hate curving. Anyhow lets see what do I want out of this blog, mostly just a place to rant about my day to day projects and thoughts. I tend to rant to seperate people about different things depending on their interests but I thought I might as well collect it together for everyone to see but also talk about the things I thought no one wanted to hear. 

Okay so some other stuff I did today was burn all of The Pillows distography onto 4 discs so that I could play then on my laptop and in my car. Their actual cds go for like 50 bucks each and theres 30 that exists so theres no way im making a real collection. I do like the idea of having more physical media though and I've been working on creating my own archive before the "Big Ravine" (A 3body problem refrence to the horrible downfall of humanity). I think I'm going to create a seperate segment here about the specs of all the thigns i'm talking about so that I don't have to explain every single time what I'm working on. Also a more general overview of all my previous projects and ideas of the past few months.  

I also just booked my full trip back to New York City, I lived there for 10 years and it'll be nice to travel back alone this time and revisit some memories and make some new ones whiel visiting Cornell. Was literally the last of my savings so hopefully I'll get a more solid job compared to the tutoring I'm currently doing. I would also like to move there for the summer but I'll need to save up first. 

Im still considering how I want to go about talking about illegal stuff, maybe some weird like password stuff with tor but until then I'll just avoid those ideas. 
```

## File: _posts/2025-03-15-zero-post.md

```
---
layout: post
title: "The Past"
date: 2025-03-14
channel_name: post-zero-post
---

So my daily drivers/previous projects, lets try and start from the beginning.

I'm currently running a windows 11 computer with a 5600x and a 4060ti 16gb, i used to have some older intel cpu and a 1070ti but now they sit on my flower in a half finished attempt at figuring out linux for the first time. In terms of laptops I started with a 2060 based gaming laptop but now I main my beauty W530 thinkpad. She's truly a show of my current ablitlies as everything I set out to do has worked. Running arch linux with the i3 window manager, plus I cracked her open and corebooted it, I swear I'm the 2nd person to ever successfully done it. 
I keep a raspberry pi for any side projects like i have a 3d printer that has broken down over the years, its an ender 3. I also have a resin printer thats fine but resin is buch harder to work with post print so it didnt fit my needs well enough so it has also gone on the floor grave yard. 

I recently bought a used server rack with 10 individual drives of 1tb each. Its running trueNAS and is in workign condition suprisingly however I'm using it as a long term data center so that when the internet gets more restricted that I'll still have access to inportant information. For some context I am not a fan of the way America is heading and based on the large amount of content I ingest daily, I do sort of think our time as the global superpower is over and itll cement its spot through world war 3 in some battle over taiwan or something. 
In conjunction to this is all of the chinese propoganda I read when I was 12. Through Cixin Liu I learned a lot about the cultural revolution adn science in general. It then motivated me to learn more and even take some mandarin classes. 

Some smaller side projects I've done include, the Casio modded watch I wear, the jail broken ds and switch I set up to never use, the nvme ssd Im saving to virtually run a small LLM so that in the event of a global outtage that I'll still have a teacher for doing my projects. 
These are mostly just the tech projects I've done but I'm sure I will add to this section more as I need more context for my future posts. 
Some things outside of tech is the Math major im currently trying to aquire at Cuesta. Taking Linear Algebra, Calc 3, and an intro to calculus currently at the time of creating this. 
```

## File: _posts/2025-03-18-second-post.md

```
---
layout: post
title: "Women and why I'm 6'1"
date: 2025-03-18
---
So basically. . .

Lets start with a stat "Nationwide, women comprised 58% of all college students in 2020, up from 56.6% six years earlier. Women have outnumbered men among college students for decades, but the gap continues to widen". My mornings spent grinding out homework and studying for midterms I start to notice that 90% of the people doing the same at my local coffee shop are women. While this is not new, it is increasing with our generation. This is obvious as we begin to see the radicallizing of the male demographic in the conservative direction. As those who value education aim towards Liberalism, women begin to move further in this direction as they learn and prioritize their rights that are being strained. Another quote "By the numbers: Women aged 18 to 29 are now 15 percentage points more likely to identify as liberal than men in the same group, according to Gallup data. That gap is five times larger than it was in 2000". The internet is at fault here as we see a ever increasing access to information which logically would lead to higher education and learning. However, as we've seen due to algorithmic platforms it directs what we are shown and how we learn. Misinformation and educational materials have gone hand in hand, with the internets growth its rather the same trends just at a larger scale.

Opression in a free internet or even in a restricted internet is harder to accomplish I will admit. Through the lens of the Chinese Netizens they have to deal with the big firewall and constant survaliance, ways around this are always found. If a human created the opression then it would be naturally flawed and has the ablity to be worked around, some examples of this are the sesorship of words. Increasingly the Chinese populus finds more and more creative ways to spell out their dislike of the government by finding names that don't get flagged but can be understood at a glance by a fellow Netizen.

I do particuarlly hate the dislike in new tech and inventions, not necessarily from the perspective of if they are good enough but rather the perspective of growing through change. As phones developed quickly in the youth of our generation it was a shift in the landscape for adults as every kid demanded a screen and it became fundamental to communication. Boomers were adimently against it saying it would rot your brain and all other fears, rightfully so "A 2017 study of over half a million eighth through 12th graders found that the number exhibiting high levels of depressive symptoms increased by 33 percent between 2010 and 2015. In the same period, the suicide rate for girls in that age group increased by 65 percent". They didn't nescarily make us dumber but the inhuman nature of the constant access to the internet lead to a rise in social issues. In the end it couldn't be stopped and even grandparents have had to integrate or be left behind. Whether or not it was good or bad, tech is prone to grow and not be stopped. A smilar happenstance is growing with AI and at a rate far surpassing phones. Due to the exponential rate of growth in these models it went from months to day to day to get new models that were smarter. As a progressive techy its integrated into my life to the point I spend actual hours using Chatgpt perday. Within gen alpha I think it'll be the generation of AI as its fundamentally affecting the education system. Since they are growing up with it they will see it as morally fine and it'll exand out to the rest of the generations. A quote here "At the same time, they are regularly exposed to the idea that success involves a trade-off with honesty and that cheating behavior, though regrettable, is “real life.”" Cheating is fundamentaally motivated by your neighbor, if you seem someone else cheating then to keep up you need to cheat as well. Due to this 95% of people cheat now meaning that AI is under so much use. In conjunction to this is the insticnt to slow change. Even under Gen z you can see a fear and a lot of back speech about how AI is bad. Even though its fundamentally useful it limits our own ablity to grow and think similar to phones and will most likely cause lots of mental damage in the long term. However, trying to mitigate this has been in vain, humans are built for never ending growth even if its harmful. A good counterpoint is global warming and coal, naturally we began to prioritize green energy and moved away from polluting coal even though the most effecient approach would be increasing mining. So growth can be stopped if harmful you might say, I disagree. It wasnt stopped growth, it was redirected growth. Similar movements can be seen with open source social media platforms with transparent algorithims and a clear want from some people to use the platforms in a more positive way. Alongside this is being seen in AI beign used as a teacher and a therapist. Instead of processing the work for us its become a source of vast and easily understood information. With the good comes the bad, either way being transgressive is counterproductive and we should accept AI with a smart approach rather then deny its existence.

Lets see thats my little rant on why I find AI haters to be annoying. Some other things I've been thinking on recently are pens and IEMS. I like my Cross pens I got for christmas and I've realized how nice it is to have a nice writing experience. On the topic of IEMs Im thinking about what DAP I would buy alongside some wired ones. Due to my increase in productivity I've been listening to a LOT more music and a higher quality experience sounds pleasant. Really I've been broadened by the understanding deeper of my niche interests and I've been accumulating a list of the little items I want for my projects. However, my tutoring job only pays for some of my food sometimes. I wish I could get more finacial support from my parents but I suspect they consider me a leech. Learning about temple Os and how it took many years of productivity to build all the aspects of a computer, I would like to try something similar but school dominates so much of my productive time currently. Given a summer break without a girlfriend I suspect I could do big things on my own. 
```

## File: _posts/2025-03-19-third-post.md

```
---
layout: post
title: "The Heart of the Internet"
date: 2025-03-19
---
Where is it?

The birth of the interweb, a truly monumental moment of interconnectivity that has nearly reached every corner of the world in modern day. Such a complex web of connections, it grows and shrinks, forming new connections like a brain, from some perspectivies it could be considered alive. However, something needs to feed this creature, as humans add and remix we get a system of production and sharing. I wanted to know where the heart of this beast was and is. A clearer picture is formed looking through the history of the internet. We see message boards and forums gather people based on interests. The largest being 4chan, we would witness its creation of content and its spread through the other social media platforms. Memes and the details of peoples lives with their ideals smeared across the screen, we had a beating heart and all the limbs that would connect the dfferent generations and types of people. In modern day these messages boards have died off as those who grew up with it grew out of it. Seeing Gen Alphas current hold on the creation of content the platform has shifted. No longer held in such a free and unsensored place many of the platforms hold mostly isolated sub groups of the internet moved by algorithms. Like an octopus, has the internet grown to a state of needing many hearts? As shortform has culminated into the new media format after the video format rose past message boards, theres been a shift into a creator based representation. Like the democracy of a nation, its grown too large for every person to vote on every decision. So we pick our leaders, who we believe to embody our ideals. Similarly the creators we support online now embody our voice. The rise in parasocial relationships can be linked towards increased loneliness due to the descructive nature of social media; however, it can also be connected to our need for representation. We no longer can be heard screaming out to the void, so we put our energy behind our community so someone can voice our needs. So my hypothesis for the current heart of the internet is not a platform, rather its a group of those who are watched. We are all no longer creators, we serve the larger machine known as the internet and those who feed it. 

Recently I've been attempting to do more Biphasic sleep. I usually sleep so light because I have several friends in different time zones and I like to be avaliable at all times. In making this less straining on me I've wanted to split up my sleep into long naps and use the offset to capitalize on it being less busy late or early in the morning. Makes being productive easier; however, it is disruptive to those around me. 

Building back up my writing chops I've started thinking back to my college essays and how far I've come since writing them. Its regrettable that I've been freed from my depression only recently; however, it does give me hope that with our without school I am self motivated enough to grow and learn on my own. 








```

## File: _posts/2025-03-20-fifth-post.md

```
---
layout: post
title: "One More Notification"
date: 2025-03-20
---

Heyyyy it only took me two days but now you can sign your email up for the greatest content ever. 

So do it. I'm too tired right now to actually make a new post. 
```

## File: _posts/2025-03-26-sixth-post.md

```
---
layout: post
title: "The Full Story"
date: 2025-03-26
---

Human ignorance and degrowth. 

Never shall we all know the man behind the strings, the plan for us all. I don't believe in a god but the more you learn the more likely you are to believe in determinism. A quote from (Free Will and Neuroscience: From Explaining Freedom Away to New Ways of Operationalizing and Measuring It), "Neuroscientists identified a specific aspect of the notion of freedom (the conscious control of the start of the action) and researched it: the experimental results seemed to indicate that there is no such conscious control, hence the conclusion that free will does not exist". We only "decide" a choice until after the electrical signals have already procesed it and acted. Its also been shown that believing in determinism over free will, just makes you sadder. So in my life I try to believe I have control, similar to how a scientist differientiates spirtuality and their work, so do I try to seperate my mental happiness from my awareness of reality. 

The point of showing my thoughts on this topic, is to illustrate how I worry about others. Having gone through my own mental health journey and ending with therapy and medication, I think that empathy stems from life experience. A stupid statement because of course you can better understand others emotions if you have also felt those emotions in the same situation. My point is that we all experience and learn at different rates, its a weird reality that those who are given more traumatizing life experiences at a younger age tend to seem more mature, albeit also more stunted from further growth. My worry for others is that we aren't all on the same path of growth, the most knowledgable and empathetic person I know is still learning and expereincing; however, in my maybe limited world view I do think that the end of the path is an empathy that accepts all others and yourself while keeping accountablity and kindness. With the people I've known, I try to remind them of the proverb "Never attribute to malice that which can be adequately explained by stupidity", I think no one is really trying to hurt each other unless they believe they've been hurt personally. Miscommunication drives hardship, but I've been tetering on whether or not thats intirely true. I rely on a trust that others will understand that I do not have ill intent, so I make my choices without asking, its given me the power to accomplish anything I seek out while damaging those around me. Actions are inherintently neither good nor bad, the intention is the problem. I think it might be a logical fallacy that I believe, and it leads me into the moral right in my head as my intention is never bad even if I hurt others. There in, it is their fault for missinterpreting my intention. It is something I would like to work on, but I also believe that to get any progress and strive forward we must stick by our ideals. People pleasing leads to inaction and abuse of the self, choosing to be disliked by some rather then "liked" by all is an ideal many people share once they get further in life. I want to be liked and I do try my best to bring kindness to everyone; however, a tolerance of all is a tolerance of intolerance leading to pain even when your intentions seem golden. 

I think this is how I ended up centrist. I hate the policies of the right and their intolerance of those just trying to express themselves, but humans are humans and that includes the stupid intolerant ones too. Tying back into my belief in determinism I think its hard to hold someone accountable when their unfortunate life circumstances lead them to a position that they might not have wanted. At some point we must hold people accountable or we bear the risk of extra suffering spreading from those who have suffered; however, I like to be kind to them nonetheless. 
```

## File: _posts/2025-03-27-seventh-post.md

```
---
layout: post
title: "Being Young"
date: 2025-03-27
---

Woe is me. 

As I sit in another public student library I feel a sense of gratefullness for being young. My parents having instilled a sense of extreme close heartedness when handling money, I seek anyway to avoid hotels, travel, and eating. It leads to a sense of homelessness, no where to go, no where to stay, only the bags on my back and time. I don't want to end up homeless, the people on the street fear the system and the work that comes with participating in society. That ideaology grosses me out honestly, its so naturally inhuman, we all want to avoid the work that hurts and yet we know that living is just naturally work. 

I want to grow past this stage in my life. Albeit we're about to enter a depression worse then the great depression. So poor and so few jobs for the younger generations, I feel like some part of me is preparing by living on so little. Fuck man I just want human connection and tribal esk communities. My college accpetances are hingeing on everything right now, my parents could easily cover my tuition for the rest of my life. 

The life I lead is an odd one, when talking to someone more normal I realise that they have seen so much less of the world and the internet. A bubbled perspective that still persists through college. I remember a kid in 8th grade who was taller and stronger then me, he was also failing the math class we shared. He said that he had more street smarts then me, I asked him if he was born and raised in this same town and he did, as someone who grew up in Brooklyn I felt a sense of pity and anger at him because I knew he was just ignoranant. I tell that story to illustrate my confusion of what sort of person I'll become, I've been accademically successful and unsuccessful, I've also travled plenty and gotten to know plenty of people. I strive through personal projects and yet I'm not some weird protidgy thats gonna create microsoft in his basement. I worry that the person I'm bound to become is homeless, I had a long conversation with a mentally ill woman in a coffee shop. She approached me rambling to herself and began to tell me stories about her wild life and how she graduated and was successful; however, she had cancer and didn't trust the doctors, believing that the medicine was killing her. Shes techincally right because the medicine makes you feel so bad but there needs to be a level of trust in the doctors as I'm sure the medicine needed to hurt the immune system similar to how the human flushes out disease using a fever. The pain doesn't come from the disease, it usually comes from the cure. I mention this becasue I felt like I understood her situation, she was very libreal and opinionated sharing many of my ideals, and yet ended up an insane mess talking to anyone who would listen. This blog is the display of that, I would text anyone who would listen to the point that I thought it became too much. Now I ramble at a screen because I have no one who stays long term in my life. My fault or not its a reality and a lonely one. 

So I plead to my youth, theres still so much time left to figure out who I am and where I want to go. I know some things about myself already. I know I value an intimacy that lets me lie my head on their lap as they brush my hair with their hands to such a high degree that I'm willing to sacrifice much of the other things I like. Honestly when I have that then I'm at my happiest, maybe because I have aquired everything else to fullfil my Maslows pyramid. Food and water comes from my parents when I'm not leading a job, my safety is always secure in the body and mentallity I've aquired. I have strong friendships who challenge me but also support me when I'm so low. I fall in and out of intimacy causing my pyramid to shake. The upper reaches are simple for me, lots of things fullfil me, who else spends so much time reading, writing, learning, while also being a math major. All thing excite me as I am a curious creature by nature. Feeling a pride for my acomplishment is something I faulter in at times, getting rejected by every college is a humbling moment but becuase of it I have also built up my own acclaim that I ride off of for pride. In the end all I really lack is someone to stand with through it all, I like to believe almost anyone can fill that spot so I give everyone a chance but my hole is still a hole. 
```

## File: _posts/2025-05-25-eighth-post.md

```
---
layout: post
title: "Obsessed With You"
date: 2025-05-25
---
LOL imagine 

Been a hot minute, summer has started and the world hasn't gotten any better. Lets see if I can think up anything profound to say. The title indicates I have some kind of romatic interest right now but that can't be further from the truth, as of the past month or so I've been completly single. However, its the title of a good song from the Orion Experience. I still haven't spoken to Orion, I miss him yet I remember his crass nature and I cringe. 

I'm off to UC Santa Cruz most likely for my math bachelors and hopefully a phd so I don't have to join the work force. I seek to bridge the gap of relativity and quantum mechanics, through a pure math view of string theory. Now I have a month to kill and I sit in a coffee shop sipping on a monster that I don't need. I fixed the keys on my thinkpad to actually work and I can now hotkey skip songs. 

I got a F-91W casio, its so small and weighs so little that I don't notice it on my wrist. Hopefully I'll replace the eletric board in it and attatch a heart monitor and a long range broadcaster. 

I upped my meds again, feelin pretty good cause of that, now I just need to escape this place and never come back. 

I really dont have much to say.
```

## File: _posts/2025-05-31-ninth-post.md

```
---
layout: post
title: "Ostrtch a flightless Bird"
date: 2025-05-31
---

Can we fly, sigh, or die? Life will just pass us by.

In an era of infinite choice, why do we struggle at all? The answer is that most people don't. Never needing to see a perspective other than your own, never needing to argue when you can always just leave the conversation. No accountability and no reason to ever feel a negative feeling. This is known about pretty commonly, there are so many bubbles and echo chambers of thought. However, in my process of consuming media, I come across another villain of growth and criticism: the defense. In getting angry and trying to pick a fight, many people will just reiterate, "Go somewhere else if you aren't happy." Not only does it separate us into our bubbles, it also disables all criticism.

The paradox that arises is that most criticism is stupid and deserves to be ignored; however, most people are idiots, and that includes both sides. So what do we do? Give up, surround yourself with who you deem smart, and try not to think about the things you don't know, feel a sense of superiority over others online. That's what the majority of people will do, but let's try to be different even if we still end up in that group without realizing it.

Now, how do we achieve this enlightenment over others, aiming to go outside our bubbles, always advance toward new knowledge, and actually accept and internalize criticism? I say we do this through... Well, I don't really know. As I drove, listening to a book about holographic theory from theoretical physics, I began to appreciate that I had become my father—or at least what he wanted me to become. All throughout my childhood, he'd make me listen to audiobooks about physics and read papers to him at night. I hated it at the time; so much went over my head, and it wasn't what I wanted to do. However, as I began reaching out to other subjects, I struggled, while with math I already had experience, and it became easy yet rewarding.

The point in that story is that I'm not just more aware or smarter because of my efforts—it's been a passed-down trait through nurture. Man, this is breaking down quickly because we dive into determinism, and we can't change who we are to be better because we will already choose to do all that we can to be better. So once again, we loop into the same group. There is no saving others, there is no changing society on a mass scale. So all that we can do is stand with what we are given and look down on others because we can't even choose to look up.

That's pretty dark. I think there can be something said about activism and reaching a mass and educating them—like a teacher, streamer, president, or deity. That's inherently egotistical: to believe that you aren't captured by a bubble of thought, that you don't shut out criticism. What you know must be shared—this is how dictators and new ideologies spread. A middle ground? Why, of course—if only we were doing that already.

This is just my internal debate. I think I know so much, and I try learning so much, but I feel a sense of being so limited in my scope, and yet the majority of people are below me. It seems I'm diving my way down the Dunning-Kruger effect. As I see the bigger world, I also see all those who are blind to it. I assume that people further along this journey of knowledge just surround themselves with people equally far so they can discuss and feel seen. So it would seem that again they are no different from the rest of us.

There is no escaping the bubble. It's human nature to be in a smaller tribal group, we can only maintain around 150 people in our heads at once. The internet brings us the crossbreeding of ideas, and yet the wars we used to face come out in smaller-scale arguments online. War, of course, still exists but is mainly a result of this upset of tribal sizes. No empire lasts.

It seems like a complete separation of bubbles removes all issues and lets us live in bliss—again leading us back to the ideology of "Go somewhere else if you aren't happy." So maybe these people are right: you can't escape your bubble without replacing it with another bubble, and there is no reaching out for more, so why take in any negativity?


I'm not sure, but personally I think it's all stupid. Just try to be kind and learn new things.
```

## File: _posts/2025-06-04-tenth-post.md

```
---
layout: post
title: "Getting out of the house"
date: 2025-06-04
---

We did it ladies and gentlemen. 

With 12 days remaining till my exodus from my house I relish in my soon to be freedom. The ability to wake up early, shave and shower, then put on some running shoes and head down to the cold misty Bay Area fog, run a couple laps then head back to my dorm to gather my stuff and head to breakfast. Three meals a day is heaven, I feel my body crying for more food. Daily human interaction, I can meet new people. These have been some of the fastest and slowest days I've ever experienced, no new memories really being made but the process of sitting around is grueling in the moment. 

I have a consistent dream of observing a person's anatomy in as much detail as possible, feeling every tension in every muscle, the way their blood flows and discolors their skin, the shape of their bones. Then putting it to a canvas, I don't know how to paint but I feel the urge to capture the moment and the three dimensionality of paint layers when compared to the photograph. I need a muse, building an understanding of the body through observation of friends and partners, I've somewhat recently learned that my concept of the human form is limited still. 

I asked someone, if they had all the money and time what would they put their passion behind, the limits of work and education neglected. To no reply I sat thinking about it. As a hard question we seldom think about it, what choice do we have to dream? We must choose to enjoy what we are given, most. I would like to travel with education in mind, see all the great people of this era and see where humanity stands in the most abstract of places. While taking time to myself to paint, traveling with someone else is key because an experience alone is a tree that no one hears. So many of my ideals stem from works of media like *The Wind Rises* and *The Dark Forest*, both romanticize the sciences while showing its self-implosive nature. 






```

## File: _posts/2025-06-14-eleventh-post.md

```
---
layout: post
title: "Yinz"
date: 2025-06-14
---

Youse will never see this coming. 

So the last post was so wrong, I've got 8 days from today till I leave, I'm unsure of how I counted the days so poorly. New glasses soon, I'm still waiting on several packages that haven't been announced to be shipped yet. 

Theres been a lot of major protests across the US for the ICE to back down and stop deporting people without due process. 

I put in one of my projects onto this site, its hopefully what I'll do my first research paper on. 

Uh what else can I say, WW3 predictions when?
```

## File: _posts/2025-06-27-twelfth-post.md

```
---
layout: post
title: "Never Ending Story"
date: 2025-06-27
---

Can't reach the stars, might as well fly to see them.

Friends and time, in a world of infinite interconnectablity there is no distance between humans. Privacy has died and we suffer together. Now living in Santa Cruz and being given the social interaction I've so desired, a question arrises. The era of infinite choice is a dilemia of reality. Do I seek to live here through my degree and develop what I can in person, or do I travel, meet the world and try to keep connection through the internet. In staying I censor my full being, humans are infinitly diverse internally so meeting that externally would bring about the most of someones life. So travel, learning, and meeting as many people as possible seems to be the freedom and enlightenment. However, this is not the reality we imagine it to be, pure surface level living. Although the living is large its not inherently worth anything. 

I know my choice already, I seek to keep moving, my sense of self is too strong to let it settle enough to adapt and solidify. Yet a very long term study from Harvard displayed the importance of interpersonal relationships that have depth and value, towards happiness. Like siddharta am I meant to travel only to then understand the importance of settling. Maybe so

Why not have both? Nomadic tribes described our origins as humans, it feels as if I was designed to gain the most value from that. In the current times of economic hardship its chalenging enough to want to live at all, let alone live large. So I lean towards acadmeic travel, boosting off of programs and foreign universities I hope to see the world and its people. 

```

## File: _posts/2025-07-02-thirteenth-post.md

```
---
layout: post
title: "Ugly Choices"
date: 2025-07-02
---

You carve the mask you wear, so why make it ugly?

Having physically and metaphorically carved out the persona I wear, I find a contradiction in my empathetic efforts. To expect that everyone is a carver, we choose what we outwardly display, even if that's a mask of our own face we have to shape it so others can see us. So I assume that many people think like me, they have their internal self and they project outward some persona. In doing so they make choices, this or that will come out, so begging the question, why do people carve ugly masks?

In my understanding of others I can see scary, pretty, or silly masks; each with their uses. While some choose to be unappealing for the conservation of their internally safety, the same can be said for a pretty mask, it will keep others out through displacing the observers understanding of the individual. Whether we bring people in through how we define ourselves or push others out, we carve our external perception.

Neglecting the flawed nature of man like one would neglect gravity, I want to know why some choose an ugly mask. To disturb the comforted is an act of art, the same can be said in how we present ourselves, yet the detail is what separates gallery material. Why present such a flawed persona? If all are as conscious as me then. . .

Man this is some psychopathic talk, bullshit about controlling the people around us in our interactions. I'm in a worried state, I think as to why I hate the people around me. I can appreciate those willing to put every fine detail into their mask but in the end we fail to show them for the art they are. A painter needs to finish their masterwork in order to display it. Yet I walk in a display of garbage, the painter is infinitely deep so why can't they put their internals onto a canvas?
```

## File: _posts/2025-09-01-fourteenth-post.md

```
---
layout: post
title: "Shooting The Moon"
date: 2025-09-01
---

Arrows and planes were mans show of cowardice. 

To kill another person is to put a whole human life in all of its context in your hands then to cut it out of thsi mortal plane. What remains is the perception of their existence, never a first account. Its a large weight to bare yet war and murder have existed forever. Humans optimize their suffering. Although we fail to overcome the human condition and the guilt that comes with these actions, we can still give them new face. A bow is an example, we could not bear to witness the life leave others lives so we left the death to the arrow we let fly. Still that guilt never left, the mind would still haunt you for the percived sin you commited. I've seen this retorict in media before but I haven't seen the connection to planes as another demonstration. When we travel a plane is like a box that takes an hour to teleport anywhere, you can look out the window at the people and fields below but its naturally an inhuman viewpoint to be above so many others. Through such a fast method of travel we have lessened the human understanding of distance. A train or car is slower and makes it way through the lives of others, although still largely inhuman due to their seclusive nature, we do understand people exist outside of us. On a plane however, one can go from place to place only believing they exist and the places they want to exist also exist. There is no need to appreciate the tribulation found amongst ourselves and where we want to be. The avoiding of suffering is intrinscint to humans, why observe something unprevelant to ourselves? However, empathy and comradere define human sucess so we must still suffer without the visual aspect. We have slowly been removing ourselves from reality and find ourselves trapped within the suffering the mind creates rather then the suffering life creates. Depression is a bitch

Anyhow I drink a hot chocolate on a train that will never end. A book by my side and a girl in my phone. A sickness on the mind, an oil on the skin. An easily escapable suffering, yet stoics told me no and I am a man of promise. Why must I live through a period of time where treating myself is just eating a reasonable amount of food. What animal am I. 

```

## File: _posts/2025-09-07-fifthteenth-post.md

```
---
layout: post
title: "Boogie Woogie"
date: 2025-09-07
---

I was spun into her arms. 

A clap, a jerk, a snap, a crackle, and a pop; and here I am today. Some random Saturday in September. 
I reference actions I've taken without anyone understanding the deeper context but I guess the point of this blog is to explain those references. Boogie Woogie is my favorite genre of jazz swing to play on the piano, every once and awhile I would hop on the piano in Stevenson Fireside lounge and drum some out. It was a self taught piece of always liking the nature of jazz, tuba is mostly concert based so I could never flesh out the dream of the chaos found in music. 
I reference a calculus principle, a jerk, a snap, they're different forms of derivations of acceleration, so basically faster and faster motion. All to discuss the dancing and clapping of boogie woogie, some of the most fun dancers out there. 
As the quote goes "slowly, then all at once", life comes at you. Like a crackle and pop, faster then you can understand. 

Theres so much to say, who knew anyone would read my stuff. I surely didn't, but being caught off guard was for the best, some guards won't come down until snuck around. So I intentionally leave gaps in my armor for those keen of eyed. 

I don't know if I can top myself, my heart has been treated nicely, not twisted and strained of all it energy. Would vincent van goh be the same artist without the depression. I keep thinking of that and what it means to me, medicate the art out of me or medicate the limits out of me. No need to scream at the void when you have someone to talk to. Shot straight in my heart, bleeding out words on the page, but thats not the case here. I've been tapped like a tree and sap, drip fed. Will it sustain you or will you drive it deeper till I spill out. 

Gotta remember the things I said, no more censoring myself or telling half a story. Literally just reminding myself now so I don't do it cause like now theres a lense focused on me, can't let it dictate even if its someone who is so supportive. 

Okay lets read my notes now, whats it say, Whats it mean to be "undatable"? Could be one of the worst and best questions, cause if you think about it even Hitler had a wife. Thats sorta a silly way to look at it tho, the question has another meaning less apparent or at least my interpretation of it. I think the question really was, "are you deserving of love?", keeping with my hitler analogy for some reason but many would make the case that he didn't deserve that love. The thing is whats my opinion? 
Little side tangent but if were going into every detail about myself I need to make it clear how I talk. I hate having opinions, or I guess more particularly I hate making choices. Talked to my therapist a lot about it, in speech I've learned to quote other people to dodge around giving my own take. I think its a two fold problem, I avoid it for fear of being judged and showing the sides I take but also as the mindset of the duning kruger effect. I have put myself in the valley of despair and don't hope to leave it. I know nothing because there is always more to know, Thats not a complete description of how I stand though, many topics I think are straightforward enough and aren't multi faceted, like hey lets not kill kids in Gaza and lets take money and power away from billionares. Opinions I dodge tend to be related to perspectives on the people in our lives or the aspects of how we view nuanced media. 

Totatlly not the second day I'm working on this now. Anyways my point of saying that I hate choices is to make the point that I've got some weird opionions. Did someone as bad as hitler deserve love, I think so. Everyone deserves love but not in the like bible, road sign way; more in the way that there can be found an infinite depth in anyone that should be explored. My endless curiousity tells me every corner needs to be traveled, no matter how bad. You do not have to be good to be explored, I think it comes down to whether I want to explore you. I personally wouldn't explore hitler (idk why im still on this analogy), I wouldn't explore a lot of people but you, you I would love. I think you are not only deserving of love like all people, but also deserving of my love. Bit of a narrcistic thing to say, especially from the curious whore that I am. But some people dont have the eye to see the gem right in front of them, undateable. I don't know, thats my opinion though. 

A silent spring dances into a firery summer, and hopefully an endless fall, that brings the bitter cold of winter. Surronded by books, a mind that can't contain it all, an outward soul I scan from left to write. Why did I have to wait so long for you? I sit here listening to you read and think why, I dreamed of this day again and again, I wanted someone to read to me. I always thought it would be an effort, an action of finding someone, but in a blink, snap, crack, pop, Im here. 

On the lifeguard tower talking to the huzz, hitting my vap so hard I almost fall off. -JILL
```

## File: _posts/2025-09-09-negone-post.md

```
---
layout: post
title: "The Promise"
date: 2023-11-30
---

UC

350 words

		
Please describe how you have prepared for your intended major, including your readiness to succeed in your upper-division courses once you enroll at the university.

	Structured education, a blessing and a curse. Started as an advanced daycare once the Industrial Revolution began, it evolved into a global competition to reach supremacy in the job market. The value of education in the individual has declined as the structured nature reproduces the same knowledge across different contexts. Recognizing these limitations, I paved my own path, preparing myself for success at UC. 
	High school was the first limiter. Getting only a taste of college courses through AP classes, I began planning to graduate early, broadening my opportunities in community college. First, I altered my high school schedule, fighting to take seminars without their prerequisites, succeeding with AP Calc BC, AP Latin, and Art 2. Quickly adapting and learning two trimesters’ worth of material, I developed a deeper work ethic reminiscent of upper-division courses. Then, after amassing summer credits over four years, I was prepared to start my college journey a year ahead of schedule. 
	My quest for richer knowledge did not end with high school; hardening myself for even more rigor, I sought to finish 60 credits in one year. By transferring early, I will be able to reintegrate with peers my age, bringing out the essential social aspect of college that’s often missed by spring acceptees. Completing all my GE classes was a strategic move, setting the stage for me to dive deeply into math, undistracted while at UC. However, due to credit limitations, these goals were not possible under Cuesta, so starting at Cal Poly allowed me to make social connections only found at four-year institutions. Experiencing that sense of community in Mustang Band, I look forward to contributing to the peer discussions at UC. 
Alongside my required coursework, I intend to undertake fundamentals in math, coding, and physics to support my goal of focused study in Quantum Neural Networks. My fascination comes from my self-guided research, allowing me to map the necessary course material. By harnessing the unique strengths and research opportunities each campus offers, I will contribute meaningfully to the evolving fields of neuroengineering and quantum computing.


								














Describe an example of your leadership experience in which you have positively influenced others, helped resolve disputes, or contributed to group efforts over time.
	The words of a military recruiter lingered with me, trying to pull me into a life of servitude. Yet, I have no sense of nationalism or lofty ideals of honor; instead, I seek brotherhood, which I aspire to find at UC. 
From seven years of participating in concert band and five years spent in marching band, I discovered a sense of social belonging. Through marching band, I have gained an appreciation for the hierarchy of power, a melting pot of high school grades run by students. Like my older siblings, whom I looked up to, I knew I would eventually take their place with pride. Learning to the best of my ability, I was taught closely by a tuba performance major and the previous drum majors. 
I ran for drum major and section leader during my junior year of high school. In the process, I developed a relationship with the band and the skills necessary to lead one hundred people. By the teacher's assertion, I was reduced to just the section leader of low brass. However, in the year that I led a small group of around fifteen people, I paved a small yet well-developed path for the following generation. 
Leading as a social figure and a source of musical knowledge, I brought out the best in my section in structured lessons and collaborative teaching. Recognizing my limitations in the familiarity of other instruments, I enabled the best players to assist in teaching in their respective micro sections. Through my specialization as a tuba player, I spent two days out of the week tutoring the other tuba players after school, both eventually joining me in the county honor band with their amassed skills. 
Now, as I participate in Cal Poly's Mustang Band, I have been reset to zero, eager to climb back up the hierarchy while picking up every piece of advice as I go. So far I have quickly advanced my skills and brought myself to the new found level defined by my peers around me. 

								
	 								
							
Every person has a creative side, and it can be expressed in many ways: problem solving, original and innovative thinking, and artistically, to name a few. Describe how you express your creative side.
An artist imagines then creates; from painting to engineering, art has always been expansive. In cultivating this skill, I have sharpened my mind and physical coordination to build the hands and eyes of an artist. Seeking inspiration, my shelf hosts the works from Liu Cixin’s romanticized view of science, Junji Ito’s provocative art, and Brandon Sanderson’s fantastical universe. Through these artist’s influences, I have developed an affinity for large-scale, interconnected projects and a keen eye for the most minute of details. 
To capture the beauty in the world and translate it onto canvas, I began training to connect the eye and the hand. As I played with legos as a kid, I transitioned to playing with computer parts, building computers, then my own 3d printer, introducing a new dimension of creativity to facilitate my art. With these tools in place, I needed to learn their language. Through coding, interpreters like Linux, and translators like Arduinos and Raspberry Pis, I was starting on the road to comprehension. Gaining familiarity with these modern systems will lay the foundation for more complex tools offered at the UCs. 
Understanding alone was insufficient for me; I needed to produce something new. From designing swords in Blender to rendering fanart to share, coding mods for video games like Rimwold while participating in testing for community projects, and composing jazz music on my piano, I have manifested my skill through my style. In the throes of UC, I anticipate interacting directly with the community and collaborating in higher fields of study. 
In an effort to expand my skills, I encountered AI in its infancy. Participating in the betas of Open AI, Bard, and Claude, I have witnessed the community grow exponentially. Working with the major companies and smaller creators, I recognize the potential of AI in art creation. As UC stands at the forefront of tech, I look forward to advancing my integration of AI into my artistic endeavors through cutting-edge digital art labs and interdisciplinary research opportunities in AI, with the support of developing resources and collaborative environments.




Beyond what has already been shared in your application, what do you believe makes you a strong candidate for admissions to the University of California?

Literature, a fading art form, shaped my youth and subsequently guided my academic interests. Introduced to modern and ancient classics, 'The Meditations' paved my path of philosophical intrigue. Through newly found motivation to expand my knowledge of the classics in AP Latin, I accomplished my goal by translating two new books, The Aeneid and De Bello Gallico. In studying these classics, I sharpened my analytical and critical thinking skills, setting me up for success on the higher level offered by the UC curriculum. 
Encountering another story, Achilles and the Tortoise, an age-old analogy for infinity, broadened my understanding of the depth hidden in math. Directing me to calculus, I found the application of these concepts through numerical signs and letters reminiscent of the Greek classics. 
The final book, The Three Body Problem, was a unique gateway into Chinese ideals and scientific romanticism. Teaching me concepts beyond infinity and rekindling my fascination with language led me to enroll in a Mandarin class at Cal Poly. I plan to develop a more thorough understanding of Chinese culture and work alongside them in various fields of science. With this pairing of Western philosophy and Eastern science fiction, I have gained a unique cross-cultural perspective, allowing me to contribute to UC's diverse communities.
Out of the three stories, I found the greatest sense of relatability in the tortoise's character. Rather than trying to chase an infinite goal, as Achilles tries to reach the tortoise, instead I was always in the lead. Motivation is a reason to rise again, to climb the next mountain; however, what remains when you trot forward with nothing in your path? High school took minimal effort to succeed in. I sought mental stimulation, and this is where I found my motivation to claw my way out of this infinite whirlpool spiraling downwards. Therapy offered a lifeline; no longer the tortoise; instead, I found myself as Sisyphus. Through this personal and literature-based journey, I reaffirmed my self-discipline, equipping me with resilience and motivation for UC's academic rigor.	




COMMON APP
650 words
How does continuing your education at a new institution help you achieve your future goals? 

Eight years ago was the first recorded sign of my awakening to consciousness documented in a journal, at age nine I had begun my path of curiosity bordering obsession. For me gaining knowledge was equivalent to finding meaning, and the endless pursuit of knowledge has plagued me ever since. 

“Look down my throat and youll see out my ass”, the Chinese ideal of simplicity presented by liu cixin, at age 12 I was hit by masses of chinese culture and knowledge when i was recommended the book The Three Body Problem. At such a developmental age I was forever changed to live up to these lofty promises of scientists tortured by their accomplishments. But with the American dream Ive taken an odd approach to life. From gamifying the education system to sate my impatience of the spiral down knowledge, I aim to walk every road of the winding path towards world altering research. 

I grew up with a teacher, not a father. From the instant i could speak my father would have me read to him every night. Starting from a book about what a bear could see to physics research papers, he wanted me to learn it all. A hatred formed from being forced into this activity; however, as I began to understand the concepts behind quantum mechanics and fascinating ideas like instant information transfer through entangled particles, i started reading without him. His bachelors in physics and then his doctorate in immunology showed his failed dream that he was attempting to pass down to me. Taking this torch I strive to subvert expectations and leave behind his limited goals. 
Prison, break free from work culture 


yet Ive never been as one note. From the years Ive spent playing tuba, to majoring for math, adn indulging into latin and mandarin, I want to do it all and ive taken every opportunity presented to me. But opportunities dont create themselves, graduating early from college and highschool ive had a hunger for more 

Brotherhood, its what i have and what i want more of. From the first friendgroup of my childhood to the band i found myself in year and year again. Veterans come back missing the horrid war they came from for one thing, brotherhood. For the world is cruel so we must stand together. Yet we  suffer from the Hedgehog's dilemma

One piece, mans dreams have no end, skypeia is real 
The all blue and the hole in relativity, one goal ball lightning 
String theory 
Media and the artform of discovery, and passion of creating art, whiplash, evangelion, flcl

Cotsco easy, 5 senses, curiosity, plays to the strengths of tasting

Me I Him, patrick, patricia, patty, pat, rick, atrick, jake, patrika, p money, p dog, erik, paris, ive been called so many names that i let the people i meet choose what to call me. 

The american death of passion
	As we delve deeper and deeper into the layers of new media, new art forms, and new horizons we witness the idleness of depression take a front. From the long form to the short form we see every single aspect of every topic being touched on. Those who have the energy to discuss topics that inspire them and shape their personality, to those who watch and observe, never affected enough to want to discuss with others. There are your Stephen hawkings, serena williams, ryan reynolds, and then there are those who collect their garbage and work on the pippings of toilets. Death in obscurity has existed in time since the beginning yet we see it take shape on the internet as well. Who will watch like and follow? The term coined for these people are “lurkers”, what is an artist without their audience but then i ask, why can't everyone make art while appreciating art? 
	As an early grad I watched my friends as they composed their ED essays trying to stand out through their accomplishments and their writing. After reviewing so many essays and making comments and changes I only believe one of my friends stands out in any way, yet I don't think it's enough. Reading even the examples of the essays that got kids into every Ivy and I think of them as uninspired. Kicking up to the admissions officers, I even read some shit I wouldn't even categorize as material worth reading got people into schools like berkeley. We are surrounded by the opportunities to read and watch gods among men create art yet there is only a systematic pumping of the death of creativity. 

	Building 20, a thrown together mess is where innovation comes. From life itself being created in the beginning as a mess of compounds with some electricity run through it. Greatness was a coincidence on a coincidence

	Intelligence, supported by recreation, is the epitome of college and innovation pushing research. We see that the developers of the atom bomb would kick it at the Owl Bar and Cafe by the trinity site because time spent working needs its flip side of the coin. 

	My favorite number is blue, kick at stupid quirky essays


does eating a bagel at 1pm contribute to or take away from the absurdity of life? 

Ignorance versus arrogance, the folly of man and the only reason man can exist

The best opener “what math class are you in?”

The hopeless decent humanity will fall into with ai and love
Love and AI
The brain is incapable of genuine originality. All ideas are a melting pot of ideas and connections, in our limited nature we’ve seen the rise and villainization of AI. A creation of our own, fed data off of our own existence and interactions, what makes it any less human than us? Working with the betas of many of the largest ai companies, and experimenting with the less restricted small creators, I have witnessed a step towards new life. While AI grows in quality a new era will arrive but we are already seeing its effects in love. 

The tortoise, achilles, and the infinite motivation derived from depression. 
Fueled by the crushing weight of depression, my awareness of the emptiness led me to do anything to claw my way out. 

The bamboo mine hanging from my rear view mirror. 
Featured in Ball Lightning by Liu Cixin, a character grown in a military milieu hangs a small bamboo segment from the mirror of their car, when discussed it reveals an important part of their character. They find beauty in the horrific nature of war time technology, a mine made by the Vietnamese to be undetectable and to maim soldiers. So I recreated it without the gunpowder, my inspiration from this scene stems from the insanity that's needed to push new frontiers. 

Competition and laziness

As my parents have and forever will tell me, I am lazy. Like many other young adults I struggle to clean my room and prepare myself food, choosing to eat out instead. However, these are self motivated tasks, I strive off of competition. From the instant I hit Calc AB a small fire was lit inside of me, to be better then the best in the class and accomplish something meaningful in a passion of my own. It took me farther then just good grades, I needed more and my teacher was done teaching the material by the 2nd trimester, so I chose to take both the calc AB and BC seminars at the same time. I would be throwing myself into the next level without any of the prior material but I had to sate my fire. New competition arose, the kids in the highest math class at my school all in one room, it was inspirational. Every practice AP test a new milestone that I would get to compare myself with others, I had to make major educational and logical jumps to keep up. Yet at some point near the end of the trimester I had succeeded, I had caught up to all of these advanced students. I was once again bored. So I decided to throw myself into the deep end once again, if there were no more math classes at my school then I would just have to graduate the very same year. So I did, tossing aside my senior year of highschool I opted instead to do summer classes until my all credits were completed and then start at my local community college. 

Scars that itch
Healing, what’s it mean to grow? To reseal an old wound or to develop a new limb from the hole that was once there? Yet a wound won't disappear. Some scar remains and they itch. 
Scratching an itch can reopen a wound or remind you of once was there, a sort of motivation arises remembering past loses. 2nd chair, a C in a class, a broken heart, all remind me to push harder each and eveytime, 1st chair honor band, an A, a new relationship. And you keep scratching, a college band, an early graduation, 30 credit semesters, a life long partner. 


Fabricated love
 
	Returning to a diner I once found familiar, rows of seats from the 50s, rounded ceilings like a submarine, a hum of the morning. I felt the vastness of life crush me. An old feeling conflicting with new perspectives, the world would hurt. Yet, the world, the endless sea of change and life, switches off like a light. A void fills everything, a peace in emptiness. Those eyes, I have waited to meet those eyes once again. But, as reality is cruel, the lights turn back on. This never happened, the Court Square Diner in New York City that I grew up eating at, I have not revisited. Here I make my testimony, the lights have been on for quite some time, it is time for me to return to dreaming. 
	When someone first asked me my major, I had to make something up on the spot. I had decided to cut my highschool career short and graduate a year early, so the question had finally hit, what would I major in. From that day on I told people I was a pure math major. A field of pure dreaming, a path I could leave the world behind. I knew this was right from the start of calculus, there were only small holes of freedom at first, but it was the first time educationally I wanted more. Whether it be greed or love, I have yet to distinguish the two, I had returned to dreaming. 
	

However, art has been created since the dawn of humans, as paintings came forth on walls. What distinguishes us from the primal human? Finally in the past 5 years we have created a coalition of data to serve as the ultimate tool, AI. It's also been an overused buzzword to garner over intrigue into a fantastical future. Through my experience of participating in the betas of Open AI, Bard, Claude, LLmaa, and the framework, Lang Chain, I have gained expertise in this emerging field. Moving forward,  my coding, blueprinting, and designing will be supported by AI through the skills I continue to amass. 


Scatterbrain, a term I’ve related with since childhood. While watching other kids excel at their major interests, I couldn't contain myself to one thing. This takes effect in all corners of my life, especially my creativity. “Jack of all trades is a master of none, but oftentimes better than a master of one”, the proverb that would ring through my head when I compared myself with others. 

Looking around my room I can see a progression of branching hobbies. From a shelf filled with my inspirations, Liu Cixin and his romantic views of the scientific future, Junji Ito and his horrifying yet unique artstyle, Brandon Sanderson and his huge intertwined fantasy universe. To the computer I built by myself, jerry rigged to function while missing many parts. A stepping off point for the 3d printer that I taught myself to use and build. To the figures I printed and needed to learn to paint. Painting of 3d models moving to character creation in blender and with just a pencil and paper, drawing skills further developed with a highschool class. Mixed in with the ongoing parts for a robotic hand with my understanding of arduinos and raspberry pis. Leading to an interest in linux and coding, crafting another computer out of old workstations. Tools of every kins scattered on many tables, wood carvers, solders, 

With these foundations I grew an interest in three main fields, Latin, Mandarin, and Math. Expanding outwards these three things have majorly defined what I seek in education.  From my highschool career being filled with Latin, taking every class offered at the school, impossible in 3 years but through determination and coercion, I was able to taste AP Latin for a trimester, opening me up to a new challenge of The Aeneid and De Bello Gallico. With the rare opportunity offered with mandarin being taught at Cal Poly I also had to indulge as I dream of one day being able to appreciate the many Chinese authors I follow without translation, and embrace myself into a culture that has sparked innovation in the fields of science in recent years. 

	Achilles and the tortoise has stuck with me both as an introduction into the abstraction found in math, but I also found a relatability in the challenge I faced with tortoise. For me motivation was a challenge as highschool waned on, not that I fell behind rather that even with minimal effort I could pass with flying colors, similar to how the tortoise would always be ahead. With gen z the tokenized the term “gifted kid burnout”, yet that didn't seem to fit me either. I would push myself harder to try to draw out the motivation but no matter the difficulty of the subject it would fall behind as I trotted forward. 

Describe how you have taken advantage of a significant educational opportunity or worked to overcome an educational barrier you have faced.


							
Describe the most significant challenge you have faced and the steps you have taken to overcome this challenge. How has this challenge affected your academic achievement?
	


							
What would you say is your greatest talent or skill? How have you developed and demonstrated that talent over time?
	I ask myself, how do I keep up with others? Having friends whom I support with their interests which include hosting and performing at trivia events, I realize I suck at trivia. 

Who is remembered, the man who runs the farthest or the man that runs the fastest? 
	
For me I saw highschool as too low of a point to jump into the deep end of the pool known as college. So I climbed, rather than take the steps of more AP’s I wanted to taste true college classes, so I began community college early. With each rung I got higher, my completed GE, fundamental math courses, and CalPoly classes, I had drained every ounce of height while superseding my original heading. 
	
Education has a limited scope, from starting as an advanced daycare once the industrial revolution began, evolving into a global competition to reach supremacy in the job market. Yet we see a shift in how schools prioritize students not failing, rather than pushing the best to be better. I’ve bared witness to how this limits our outlier success cases and I have faced and overcome that wall, to sate our upper limits we have to go beyond high school. An example is to do summer classes at local community colleges. Even further, college limits the credits you can take, with these challenges I've faced I pushed past finding ways to get around the rules we set for arbitrary reasons. From taking summer classes every year for 5 years, to graduating a year early from amassed college credits. Then to bypass my community college's credit limit I began taking classes at Cal Poly through their open education program. However, that barrier of bypassing my own boredom still stands, so I strive to take that final step to one of the best educational opportunities that stand, UC colleges. 
	Cuesta, smartest choice cheapest 



MIT
225 words per

Please discuss why you are considering transferring from your current college or university, and how MIT aligns with your goals.*


How has the world you come from—including your opportunities, experiences, and challenges—shaped your dreams and aspirations?*

MIT brings people with diverse backgrounds together to collaborate, from tackling the world’s biggest challenges to lending a helping hand. Describe one way you have collaborated with others to learn from them, with them, or contribute to your community together.*

How did you manage a situation or challenge that you didn’t expect? What did you learn from it?*

 Please describe how you have prepared for your intended major, including your readiness to succeed in your upper-division courses once you enroll at the university.
							
Spinning, circling, pulling, grabbing, stretching, tearing, I could feel three flaming spheres lighting my passion. I could not stay on one path or in one spot, my motivation lacked stability, but not direction. Swirling in my dreams three stars formed patterns I wanted to recreate, understand, and answer.
	My world did not start in chaos, learning of the celestial bodies, one star formed. I needed to bring my dreams into reality and I began to code. A simple program offered from my father to find a developing definition of pi through approximation drew the outline of the stars I so desired. Finding formulas that described the movement was an easy step from there, watching guide after guide on how to create games and visual projects. I now had just enough to watch the circles dance across my screen.
	Beautiful as they were, I still knew nothing of what I watched. The question formed, how do they spin in triplets, but never perform the same choreography twice? The second sphere formed creating a binary system that generated movement with the first. Twirling together my understanding of coding developed alongside my need for math. Ignited, I listened closely in my classes for directional force, deriving for acceleration, and vectorization, seeing the constructs leading up to them, sketching out the numbers defining the newly moving masses from scratch. 
	Finally as I settled into understanding, the final sphere formed, why chaos? A question that did not lead me to an answer, rather something that would fuel my future projects. With no eternal stability found in the Three Body Problem I tried to leverage it as I developed an interest in cryptography, and temporary solutions. Building upon my ever developing curiosity I would never stop seeing more stars, creating a beautiful interwoven dance of knowledge yet to be gained.


Through my educational journey I have been drawn in different directions by my interest in coding, language, and math. In my goal to know so much more surrounding these subjects, I have prepared myself strongly through self projecting and interacting with my local community college. Beginning with coding I’ve known computers all my life, starting with gaming consoles that lead to more curiosity that acquired me one of my fathers old work computers. With free reign over the internet and the means, I was first introduced to writing code by my father as he showed me how to approximate pi with a simple program. From there, combined with my early introduction to the infamous Three Body Problem through a book series with the same name, I began building the stars orbiting in my mind at night. Learning C++ I gathered information through my previous knowledge of physics from my father and the internet, finding roadblocks that were left empty from my progress in math. Having started coding while learning algebra in 7th grade, I couldn’t even comprehend trigonometry. 
	So my next journey began. My curiosity pulling me forward with no regard for my limitations. I wanted to reach the summit of math so I could describe my ideas in a language computers would understand. Compressing my highschool years through summer classes I skipped up to Calculus during junior year, taking both Calculus classes of different levels simultaneously. This freed me to grab college early and continue my progress at my own pace. As Icarus fell from the heat, I also felt the burnout as I dropped out of my 2nd semester of college. Rejoining my peers this year, I had new perspective that drove my personal interest. Not just wanting the general understanding, I prompted my teacher to begin research with me on cryptography through chaos. Reading papers with him I started to see why he chose ellipticals as his thesis paper. Continuing on my own I dived into reessearch on simulations inspired by a paper on isles of regularity. 
After some time regathering myself I retook myself through igniting my love for math through language. Coming back to college I chose a German class, having taken 3 years of Latin and a year of Mandarin, I knew I wanted to know even more about how to communicate with others. As my Latin teacher said when meaningless grammar was discussed, I knew that ancient people crafted the language just to spite me, I took this personally and wanted to crack it open. 
	




							
Every person has a creative side, and it can be expressed in many ways: problem solving, original and innovative thinking, and artistically, to name a few. Describe how you express your creative side.
	
	Digging through piles of rejects I was looking for something that would finally fit me. A logo of something better, Carhartt in the Goodwill,  why? Picking up the jeans I was ecstatic, soon realizing that the reason no one else had grabbed it was the gaping hole  through the middle. Looking into it I saw immediate potential, waiting for an opportunity to learn sashiko: the japanese method of patching, I had found it. Similarly I have taken the little things in my life and put them together into something I’ll treasure forever. 
	Walls blank, I only allowed myself to decorate my desk alongside a daunting attached shelf. Quickly becoming a painting of my personality, I displayed the copies of shonen jump i gathered during my educational journey through Japan with the smithsonian. My seemingly wooden masks that I meticulously planned, 3d printed, and painted in a special technique to draw out a wood grain, hanging from my shelf, standing as a reminder of my months-long projects.  The Chinese Sci-Fi defining my inspiration to delve into Mandarin and explore linguistics with fevrovity. Sitting alongside some of the darkest seinen manga that defined my style as an artist crafting with my hand and a pen. The chess boards and notation books bringing back old memories of my chess career that brought me to nationals at age 9 and 10. Small self painted and printed figures for my Dnd campaign written and produced by me. Old matcha leaves gathered to recreate the tea ceremonies learned in Japan, found from thrifting alongside my jeans. 
	With such a diverse range of artistic methods I display my ability to fuze genres. The coding, modeling, and designing reflects in my creations. While my years in Latin, Mandarin, and german reflects in my interest in literature and history of traveling. 
  3.    Describe how you have taken advantage of a significant educational opportunity or worked to overcome an educational barrier you have faced.
	
	When I saw a rejection from college after college I continued to feel nothing, I would keep working and taking classes to try again in a year. The effects were only delayed,  motivation over the semester drained from my body until taking a step was harder than I could have imagined. Holding onto every last strand of motivation till it was all gone, I could only go up from there. I sought help, got diagnosed and medicated allowing me to bring myself back into my love for learning.  
I was no longer going to class just to continue through college, I had rebuilt my motivation from scratch and tried something new.
Much of my time is spent reading papers on various fields of science to keep up with the eeb and flow of discovery. The subject I found most curious was the Three Body Problem, a test of advanced math techniques and code optimization; recently a new paper on it arose. With it's known chaos, Islands of regularity were discovered, this interested me to no end as I strove to recreate their results. Lacking a super computer for powerful simulation data, I needed to think smarter rather then larger. With my computer at home I spent countless hours reading papers on faster and more detailed math and code, leading to billions of simulations generated in mere minutes. With such a grand number I was still no where close to what I needed with precision and volume of data. Leaning in another direction I took to machine learning, I needed a partner to learn to find the stablity and present what was hidden me. A whole new vain of code and math with matrices, I developed far reaches of knowledge purely off of my self projecting. In this field my work could only improve and I needed to learn more, generating a motivation for school that newly drove me to overcome a lack there of. 
	
	 

																		 							
    4.  Beyond what has already been shared in your application, what do you believe makes you a strong candidate for admissions to the University of California?

The movie theater behind the eyes, I’ve spent a lot of time there with the curtains closed. 




	When's the last time you had coffee? Maybe you have one in your hand or by your desk as you read this, or you don't even drink coffee and prefer tea. Who cares? I’ve been given a platform for someone to read, more like scan, my writing and I get to describe myself in a flattering light. 
	If I was reading this as a reviewer my eyes would glaze over the 2nd sentence, go back and read it if you haven’t already. Just kidding, you're on a tight schedule, let’s keep you on pace, all you want to see is why I would be good for your college. 
	Well I am, maybe if this a council based decision then you can tell the others that I’m the dalai lama, you don’t believe me but they will believe you. Again just joking, I don’t want this essay to be marked off as an attempt at a humorous meta analysis of the college board process. 
	I’m not actually this sardonic, I just wanted to practice some pathos in a way  I think you wouldn’t have seen very often today. Standing out is probably worthless if I have nothing to show when I’m seen, how about a poem? 



	I forget about the stars, the sun turns the sky blue refracting through the atmosphere to generate beautiful skies, starless. At night I sleep or stay up staring at my computer, on rare occasions out celebrating with friends, I never look up. 
	Only my appreciation for them comes from when I was so unhappy. Nights that could never end, spent driving alone, walking beaches, so much thinking that brought me nowhere no different from my feet that would return to the same bed. 

```

## File: _posts/2025-10-15-sixteenth-post.md

```
---
layout: post
title: "Haystacks and Haybales"
date: 2025-10-15
---

May my soul never know this greif again. 


May there come a day where I know freedom from the hell I created for myself. I hate myself                                                                                
How how how how, how did I do this. Fuck me.                                                                               
I hate you for being you, for being the person I need most. I hate you because I let you down. This endless ocean of my grief, I drown because I refuse to swim                                                                              
Take me, I’ve seen all I needed to see. Return me to the moon. This life wasn’t for me.                                                                                                                                                             
May I never forget.                                                                                                                                                      
Cross my heart, hope to die, stick a needle in my eye, I promise to never forget lest damocles sword fall.                                                                                                                                                
The word, all I lived for. The one thing I was certain about, the person who found it I’d love forever. Thats now my burden to bear. Why do I live now? Rescue me, I can’t swim.

Are you a dreamer too? I call your name across the vast expanse to only returning echos.                                                                                                                                                             
There is no real happiness, only dreams.                                                                               
I held that dream, snow burning.                                                                              
She laughed, lights silent.                                                                              
I lay staring at the empty ceiling just waiting for the day to pass.                                                                              
Today, I no longer dream. 


May I be reborn anew, the same person, but so much less. A husk. The chaos era never ends. 

Did the good not outweigh the bad? Will God know my wrongs from my eyes? A guarantee for Him to suffer forever. May God feel the hell he created through me. For even in my finite existence I have infinity inside me.                                                                               
I believed you had my infinity.                                                                               
May my tears stain these pages. A record, an endless record, that you can access. I showed you every corner of my heart. You never hurt any of it. Yet you leave. A womb of warmth that we are forced to leave. A still born knows no love that exists outside. May I never know the warmth of the womb again. 

The grief will wash me clean. The woes I carried roll off of me. I pray my words will bring you back, Maybe maybe maybe there exists a way back. We outgrow the womb that held us. 


Okie I’m done with the weird womb metaphor, I just liked the imagery of a complete encompassing warmth. Thats what love feels like to me, without it I shiver and the world reaches out to hurt me.                                                                               
Man you were great. Once this is on the blog you’ll probably read it. But what happens if I show someone else this blog in the future? When I gave you access, I expected you to hate me. Few people can see the love you give to others and see it as a love they can give to you. Thats what plagues me so badly. There really won’t be and can’t be a moment that special to me anymore. Like a comet it really only burns once. I know I’ve felt this way about others before, but Jill my life is the cycle of an artist, with each new piece and experience I paint I get better, sadder, stronger, weaker, more flawed, yet more complete. And so at this moment I know that this is the most I’ve ever loved someone else. When comparing sizes of infinity, theres an infinity found in the tip of my pen but that doesn’t compare to the infinity held within my mind. As I love you everything else approaches zero. May my emotions stand as pillar that I will never stand upon again. 

I’ve known so many fucking people so manyyyyyy I’ve moved like 9 times I’ve lost count, but man I’ve seen every person. Archetypes of people do exist, thats what I learned, there are others like you. I dont know how to put this into words though. I’ve dated other people like you even. Yet you you are me. Others will try to understand me, but you you can see me because you can see yourself. You know why I do the things I do, so it hurts so much more that you don’t want us. There is no misunderstanding or miscommunication, you dont want me. And I know you love me and you care about me but there is not a hope of our future you will commit to seeing. Its taken my partners months and months to begin to see me, some never really did, some came close. I suspect that seeing me is possible, but like a horror beyond human comprehension it breaks your mind. Thats what infinity is I guess, something the human mind was never supposed to contain. Hah yeah I like that. HALLOWEEENNNNNN.  
Hey Jill you should read Chainsaw Man, just the first part is fine, its 87 chapters if I remember correctly, goes by quickly. Then you can understand that previous joke. You won’t though, or you shouldn’t at least, you found the word so what do I know. You know the gears that make me turn but you havent seen how each was made. 
So much talking about myself fuck Im so tied up in my own head. Like I even basically said I loved you because you were me. So narcissistic, but inside my childhood journal theres a part that mentions how long I will have to wait to be understood. I thought that if someone saw me that they would just have to love me. I think I learn today that understanding in totality doesn’t equate to love. 

"In the moment when I truly understand my enemy, understand him well enough to defeat him, then in that very moment I also love him. I think it's impossible to really understand somebody, what they want, what they believe, and not love them the way they love themselves." -Orson Scott Card

I was gonna say, fuck you Orson Scott Card, but no hes right. You now love me the way I love myself, so not at all. I really try to love myself, because I know that I need to do that in order to love others properly but I fail again and again. 


This really can go on forever, theres really so much to say. I’m gonna really try here to give a complete picture here. Like a eulogy, I write to commemorate the people who leave my life. So many of my plans I spent years developing came to a crux. Cigarettes on the roof, a word, a silent spring, a blog, a pen, a prison architect, an illegal knife. FUCK man I dont know, there is a sort of humor behind it all. Theres so much buried irony in receiving everything I’ve ever asked for and smashing my face into the wall. Like King Midias I let my greed consume me, yet I reached out to only touch myself, for maybe in my death I’ll shine golden. 

The person I look up to most to this day was my guide on my trip through Japan. His name was Brian, he was 34, 6’2’’, he had a girlfriend and kids living in Canada while he explored the world. He would switch languages with her so that she could practice her native tongue of Japanese so she wouldn’t lose that part of her culture. He showed me so much love like a father I didn’t have, he criticized me to help me become the person I wanted to be. When I saw his smile I saw a love, a true love, sculpted by years of living. I asked him how he didn’t become jaded from all tha pain. I don’t remember what he said, but he showed me it was possible. I seek to match that. To come out of this all with a love thats unwavering. I don’t know if my approach to achieving this is right. I think I’ve found a way to love people unconditionally. Yet now I grapple with that love being too much for myself to handle, that love doesn’t fade but can be quieted by other emotions, Never anger, you showed me that love doesn’t need anger, it comes with frustration but never anger. Thats what I want to carve into my fathers grave, for maybe then he would know that truth. 

The hedgehogs dilemma leads into this quote, no real source

“Love is about finding someone worth forgiving again and again” -unknown

I believe this so whole heartily, I don’t think I’m the person that you should forgive again and again, no matter how much I want to be that person. Thats why I apologize again and again, becuase I am not that person. 

“Have enough courage to trust love one more time and always one more time.” -Maya Angelou

I will also continue to live by this quote, I need to continue living as the wind rises. I will be okay.                                                                               
Thank you Jill for the times we had. 


Text me the word and I’m yours anytime.
```

## File: _posts/2025-10-28-seventeenth-post.md

```
---
layout: post
title: "HUH?"
date: 2025-10-28
---

Oh man I'm somewhere right now. 

WHaT? Who the fuck am I? I really thought I knew, I've come to settle in my own mind, so many mood stablizers. I may not understand exactly who I am but I know how my parts work. However, that gets upended. I think its really cool to be given a whole new perspective, so different that its world shaking. But what? I thought I was done, seen it all, in the sense that I knew theres always more to learn and change with but that adaptablity was earned and structured. I thought I knew all the storms and how to weather them. But what? I've been beaten and abused and still sat stoically through it supporting those who are hurting, because I know that pain. What is this though, I'm excited cause its new to me but so confused because I didn't think anything could be new. So I don't know how to approach this. What do I do? I thought I knew everything. Whatttttt. I can so easily just run from it. That could be the right choice. Fuck though my curousity is my greed is my downfall. So I want to know more and understand more. I am manic, I haven't manic like this in awhile. Its never been induced in this way by someone else. The meds keep me down though. I won't do whats past me. This is why humans are infinite, but in the way that a circle is infinite maybe. Or possibly a spiral. Because our ignorance lets us forget and relearn so every step feels new. So we dance in our circle till death never truly going anywhere. Or maybe we're a spiral, now are we spiraling out to infinite or inwards towards zero? I don't know. I thought I knew. 

I want to step back because if I get ahead of myself in such a hard headed energized way I make people uncomfortable. So back to reality for a second. I have spiraled into a new positive reinforcement cycle because of some change in my brain wiring due to medication. Its giving me like a manic view on life, making things more profound then they really are. It tells me fate exists and that theres meaning behind all this thats beyond mankind. Thats what fiction is all about. I've dived too deep in my dreams. God damn, fuck you whoever is up in the clouds watching me. I think you really think youre funny don't you.
Okay okay breath this is actually an episode. Lets take some stress meds patrick. 

I would like to explain why I think this is all so important but I think putting that into words only reinforces the thought and I need to create distance. Nothing happened. I'm like a religious zealot that has been looking for a sign all their life and just happened to be struck by lightning and survive. I don't want to be a crazy person. I can recognize reality from dreams. Fuckin Murakami. This is a test or more like a wall or warning. Hey I'm fucking insane please don't try and feed the dogs. I am the dog though and I want to be fed so badly. But I love those who try and feed me, I love them enough to look scary and bark really loud. Tell me I'm freaking you out. Tell me I'm bad. So that I can move on. Otherwise feed me and pet me and be the one who sees me. Until then fear my sharp ears, and my bark. I will growl.
```

## File: _posts/2025-10-29-nineteenth-post.md

```
---
layout: post
title: ""
date: 2025-10-29
---
```

## File: _projects/frog-piano.html

```
---
layout: default
title: "Frog Piano"
permalink: /projects/frog-piano/
---

<div id="frog-piano-container">
  <h2>Frog Piano</h2>
  <p>Tap/click any key to play (2 octaves). If sound is blocked, tap "Enable Sound".</p>
  <button id="start-audio" style="display:none;margin-bottom:8px;">Enable Sound</button>
</div>

<!-- p5 core + sound addon -->
<script src="https://cdn.jsdelivr.net/npm/p5@1.4.2/lib/p5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/p5@1.4.2/lib/addons/p5.sound.min.js"></script>

<script>
/* ========================
   CONFIG / CONSTANTS
======================== */
const OCTAVES = 2;          // full keyboard width (2 octaves: C4..B5)
const START_MIDI = 60;      // C4
const PIANO_H = 120;        // white key height
const BLACK_H = 0.65;       // % of white height
const BLACK_W = 0.62;       // % of white width
const ATTACK = 0.02;        // osc envelope seconds
const RELEASE = 0.25;
const GRAVITY = 0.48;
const HOP_VY = -12.5;
const MAX_VX = 7.0;

/* ========================
   STATE
======================== */
let cnv, osc = null;
let keysY = 0;
let keysWhite = [];   // white keys: {x,y,w,h,midi,freq,name,activeUntil}
let keysBlack = [];   // black keys: same, drawn after whites
let frog = null;      // {x,y,vx,vy,r,onGround,blinkUntil}

/* ========================
   UTIL
======================== */
function midiFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function noteName(m) {
  const N = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  return N[m % 12] + (Math.floor(m/12) - 1);
}

function ensureAudio() {
  try { userStartAudio(); } catch(e) {}
  const ctx = typeof getAudioContext === "function" ? getAudioContext() : null;
  if (ctx && ctx.state !== "running") ctx.resume?.();
  if (!osc) {
    osc = new p5.Oscillator("sine");
    osc.start();
    osc.amp(0);
  }
  const btn = document.getElementById("start-audio");
  if (btn) btn.style.display = "none";
}

/* ========================
   LAYOUT
======================== */
function createOrResizeCanvas() {
  const container = document.getElementById("frog-piano-container");
  const maxW = Math.min((container?.clientWidth || 640), 1000);
  const w = Math.max(300, maxW); // Reduced minimum from 420 to 300 for mobile
  const h = Math.round(w * 0.55); // aspect
  if (!cnv) {
    cnv = createCanvas(w, h);
    cnv.parent("frog-piano-container");
  } else {
    resizeCanvas(w, h);
  }
}

function buildKeyboard() {
  keysWhite = [];
  keysBlack = [];
  keysY = height - PIANO_H;

  // white offsets and black offsets per octave (semitones from C)
  const whiteOff = [0, 2, 4, 5, 7, 9, 11];       // C D E F G A B
  const blackPairs = [ [1,0], [3,1], [6,3], [8,4], [10,5] ];
  // blackPairs: [semitone offset, index of preceding white key]

  const totalWhite = OCTAVES * 7;
  const wW = width / totalWhite;                 // white key width
  const bW = wW * BLACK_W;                       // black key width
  const bH = PIANO_H * BLACK_H;

  // Build whites
  for (let o = 0; o < OCTAVES; o++) {
    for (let i = 0; i < whiteOff.length; i++) {
      const midi = START_MIDI + o*12 + whiteOff[i];
      const idx = o*7 + i;
      const x = idx * wW;
      keysWhite.push({
        x, y: keysY, w: wW, h: PIANO_H,
        midi, freq: midiFreq(midi), name: noteName(midi),
        activeUntil: 0
      });
    }
  }
  // Build blacks (positioned between whites)
  for (let o = 0; o < OCTAVES; o++) {
    for (const [off, prevWhiteIdx] of blackPairs) {
      const midi = START_MIDI + o*12 + off;
      const whiteIdx = o*7 + prevWhiteIdx;
      const baseX = keysWhite[whiteIdx].x;
      const xCenter = baseX + wW * 0.7;        // typical piano spacing
      const x = xCenter - bW/2;
      keysBlack.push({
        x, y: keysY, w: bW, h: bH,
        midi, freq: midiFreq(midi), name: noteName(midi),
        activeUntil: 0
      });
    }
  }
}

/* ========================
   FROG DRAWING
======================== */
function drawFrog() {
  const f = frog;

  // body shadow
  noStroke();
  fill(28, 130, 28);
  ellipse(f.x, f.y + f.r*0.25, f.r*1.8, f.r*1.2);

  // belly
  fill(200, 235, 200);
  ellipse(f.x, f.y + f.r*0.15, f.r*1.25, f.r*0.9);

  // body
  fill(40, 180, 40);
  ellipse(f.x, f.y, f.r*1.6, f.r*1.2);

  // head
  ellipse(f.x, f.y - f.r*0.8, f.r*1.5, f.r*1.2);

  // legs (back)
  stroke(28,120,28);
  strokeWeight(6);
  noFill();
  // left leg
  bezier(f.x - f.r*0.9, f.y + f.r*0.2, f.x - f.r*1.3, f.y + f.r*0.6,
         f.x - f.r*0.8, f.y + f.r*0.9, f.x - f.r*0.3, f.y + f.r*0.7);
  // right leg
  bezier(f.x + f.r*0.9, f.y + f.r*0.2, f.x + f.r*1.3, f.y + f.r*0.6,
         f.x + f.r*0.8, f.y + f.r*0.9, f.x + f.r*0.3, f.y + f.r*0.7);

  // arms
  stroke(34,150,34);
  line(f.x - f.r*0.8, f.y - f.r*0.15, f.x - f.r*1.0, f.y + f.r*0.2);
  line(f.x + f.r*0.8, f.y - f.r*0.15, f.x + f.r*1.0, f.y + f.r*0.2);

  // toes
  strokeWeight(4);
  for (const dx of [-1,0,1]) {
    line(f.x - f.r*1.05 + dx*3, f.y + f.r*0.22, f.x - f.r*1.2 + dx*5, f.y + f.r*0.35);
    line(f.x + f.r*1.05 + dx*3, f.y + f.r*0.22, f.x + f.r*1.2 + dx*5, f.y + f.r*0.35);
  }

  // eyes
  noStroke();
  const blink = millis() < f.blinkUntil;
  if (!blink) {
    fill(255);
    ellipse(f.x - f.r*0.45, f.y - f.r*1.1, f.r*0.45, f.r*0.45);
    ellipse(f.x + f.r*0.45, f.y - f.r*1.1, f.r*0.45, f.r*0.45);
    fill(0);
    ellipse(f.x - f.r*0.45, f.y - f.r*1.1, f.r*0.18, f.r*0.18);
    ellipse(f.x + f.r*0.45, f.y - f.r*1.1, f.r*0.18, f.r*0.18);
  } else {
    fill(40,180,40);
    rect(f.x - f.r*0.65, f.y - f.r*1.15, f.r*0.5, 4, 2);
    rect(f.x + f.r*0.15, f.y - f.r*1.15, f.r*0.5, 4, 2);
  }

  // mouth (smile)
  noFill(); stroke(100,50,50); strokeWeight(3);
  arc(f.x, f.y - f.r*0.7, f.r*0.8, f.r*0.5, 0.2, PI-0.2);
}

function blinkFrog() {
  if (random() < 0.02) frog.blinkUntil = millis() + 120;
}

/* ========================
   P5 LIFECYCLE
======================== */
function setup() {
  createOrResizeCanvas();
  buildKeyboard();

  frog = {
    x: width * 0.5,
    y: (height - PIANO_H) - 24,
    vx: 0, vy: 0,
    r: 22,
    onGround: true,
    blinkUntil: 0
  };

  const btn = document.getElementById("start-audio");
  const ctx = typeof getAudioContext === "function" ? getAudioContext() : null;
  if (btn && ctx && ctx.state !== "running") {
    btn.style.display = "inline-block";
    btn.addEventListener("click", ensureAudio);
  }
}

function windowResized() {
  createOrResizeCanvas();
  buildKeyboard();
  frog.y = Math.min(frog.y, (height - PIANO_H) - frog.r*0.2);
}

function draw() {
  background(24);

  // draw keyboard (whites then blacks)
  drawWhites();
  drawBlacks();

  // frog physics + render
  physics();
  drawFrog();
  blinkFrog();

  // hint
  noStroke(); fill(200); textAlign(CENTER);
  textSize(14);
  text("Click or tap keys. Two octaves (C4 .. B5).", width/2, 22);
}

/* ========================
   DRAW KEYS
======================== */
function drawWhites() {
  textAlign(CENTER, CENTER);
  textSize(14);
  for (const k of keysWhite) {
    const active = millis() < k.activeUntil;
    stroke(60); strokeWeight(2);
    fill(active ? 235 : 250);
    rect(k.x, k.y, k.w, k.h);
    noStroke(); fill(40);
    text(k.name.replace(/[0-9]/g,""), k.x + k.w/2, k.y + k.h - 18);
  }
}

function drawBlacks() {
  for (const k of keysBlack) {
    const active = millis() < k.activeUntil;
    noStroke();
    fill(active ? 35 : 10);
    rect(k.x, k.y, k.w, k.h);
  }
}

/* ========================
   INPUT / SOUND
======================== */
function hitKey(mx, my) {
  // prioritize black keys (they visually sit on top)
  for (let i = 0; i < keysBlack.length; i++) {
    const k = keysBlack[i];
    if (mx > k.x && mx < k.x+k.w && my > k.y && my < k.y+k.h) return {k, isBlack:true};
  }
  for (let i = 0; i < keysWhite.length; i++) {
    const k = keysWhite[i];
    if (mx > k.x && mx < k.x+k.w && my > k.y && my < k.y+k.h) return {k, isBlack:false};
  }
  return null;
}

function activateKeyObj(k) {
  ensureAudio();
  if (osc) {
    osc.freq(k.freq);
    osc.amp(0.65, ATTACK);
  }
  k.activeUntil = millis() + 160;

  // Frog hops toward center of that key
  const targetX = k.x + k.w/2;
  const dx = targetX - frog.x;
  frog.vx = constrain(dx / 10, -MAX_VX, MAX_VX);
  frog.vy = HOP_VY - random(0, 2.0);
  frog.onGround = false;
}

function mousePressed() {
  const h = hitKey(mouseX, mouseY);
  if (h) activateKeyObj(h.k);
  return false;
}
function mouseReleased() { if (osc) osc.amp(0, RELEASE); }
function touchStarted()  { return mousePressed(); }
function touchEnded()    { mouseReleased(); return false; }

/* ========================
   PHYSICS
======================== */
function physics() {
  if (!frog.onGround) {
    frog.vy += GRAVITY;
    frog.x  += frog.vx;
    frog.y  += frog.vy;

    // land on keys
    const top = height - PIANO_H;
    if (frog.y + frog.r >= top) {
      frog.y = top - frog.r;
      frog.vy = 0;
      frog.vx *= 0.45;
      frog.onGround = true;
    }
    // walls
    if (frog.x - frog.r < 0) { frog.x = frog.r; frog.vx *= -0.4; }
    if (frog.x + frog.r > width) { frog.x = width - frog.r; frog.vx *= -0.4; }
  }
}
</script>
```

## File: _projects/heading-optimisation

```
---
title: "Heading Optimisation – Browser Demo"
layout: default
permalink: /projects/heading-optimisation/
---

<!-- Controls -->
<div class="row" id="ui" style="display:flex;flex-wrap:wrap;gap:1rem;margin-bottom:1rem;background:#222;padding:1rem;border-radius:.75rem">
  <label>Known <input id="nk" type="number" min="1" max="20" value="10" style="width:5rem;background:#333;border:1px solid #555;border-radius:4px;color:#eee;padding:.25rem"></label>
  <label>Unknown <input id="nu" type="number" min="0" max="30" value="10" style="width:5rem;background:#333;border:1px solid #555;border-radius:4px;color:#eee;padding:.25rem"></label>
  <label>v<sub>walk</sub> <input id="vw" type="number" min="0.1" step="0.1" value="1" style="width:5rem;background:#333;border:1px solid #555;border-radius:4px;color:#eee;padding:.25rem"></label>
  <label>v<sub>road</sub> <input id="vr" type="number" min="0.5" step="0.5" value="4" style="width:5rem;background:#333;border:1px solid #555;border-radius:4px;color:#eee;padding:.25rem"></label>
  <label>Grid N <input id="gN" type="number" min="60" max="200" value="120" style="width:5rem;background:#333;border:1px solid #555;border-radius:4px;color:#eee;padding:.25rem"></label>
  <button id="run" style="background:#16a34a;color:#fff;padding:.4rem .8rem;border:none;border-radius:4px;font-weight:600;cursor:pointer">Run</button>
</div>

<!-- Plots -->
<div id="tLim" class="plot" style="width:100%;height:420px;margin-top:1.5rem"></div>
<div id="tFull" class="plot" style="width:100%;height:420px;margin-top:1.5rem"></div>
<div id="world" class="plot" style="width:100%;height:420px;margin-top:1.5rem"></div>

<!-- Plotly -->
<script src="https://cdn.jsdelivr.net/npm/plotly.js-dist-min@2.30.0"></script>

<script>
/* ===== Basics ===== */
const BOX = 1e3, RES = 720;
const rand = (a,b) => Math.random()*(b-a)+a;
const hp = (x,y) => Math.hypot(x,y);
const randPt = (box) => [rand(0,box), rand(0,box)]; // <<< missing in your version

/* ===== Road network ===== */
function net(mask, pts, vR) {
  const n = pts.length, r = [];
  const W = Array.from({length:n}, (_,i)=>Array(n).fill(Infinity).map((v,j)=>i===j?0:v));
  for (let a=0;a<mask.length;a++) {
    const i = mask[a];
    for (let b=0;b<a;b++) {
      const j = mask[b], p = pts[i], q = pts[j];
      const d = hp(p[0]-q[0], p[1]-q[1]);
      W[i][j] = W[j][i] = d / vR;
      r.push({ p, q, i, j, d });
    }
  }
  return { r, W };
}
function floyd(D) {
  const n = D.length, M = D.map(row=>row.slice());
  for (let k=0;k<n;k++) for (let i=0;i<n;i++) for (let j=0;j<n;j++) {
    const v = M[i][k] + M[k][j];
    if (v < M[i][j]) M[i][j] = v;
  }
  return M;
}

/* ===== Geometry & heading search ===== */
function ray(S, dir, R) {
  let h = null, t = 1e9;
  for (const e of R) {
    const P=e.p, Q=e.q, w=[Q[0]-P[0], Q[1]-P[1]];
    const A=[[dir[0],-w[0]], [dir[1],-w[1]]];
    const b=[P[0]-S[0], P[1]-S[1]];
    const det = A[0][0]*A[1][1] - A[0][1]*A[1][0];
    if (Math.abs(det) < 1e-12) continue;
    const ti=(b[0]*A[1][1]-b[1]*A[0][1])/det, ui=(A[0][0]*b[1]-A[1][0]*b[0])/det;
    if (ti>0 && ui>=0 && ui<=1 && ti<t) { t=ti; h=[S[0]+ti*dir[0], S[1]+ti*dir[1]]; }
  }
  return { h, t };
}
function hybrid(r, hit, R, vW, vR, tDest) {
  let best = 1e9;
  for (const e of R) {
    const d1 = hp(hit[0]-e.p[0], hit[1]-e.p[1]);
    const d2 = e.d - d1;
    best = Math.min(best,
      d1/vR + tDest[e.i],
      d2/vR + tDest[e.j]
    );
  }
  return r/vW + best;
}
function optHead(S, R, pts, vW, vR, dest, tDest) {
  let best = 1e9, bTh = 0;
  for (let k=0;k<RES;k++) {
    const th = k*2*Math.PI/RES, dir=[Math.cos(th), Math.sin(th)];
    const {h,t} = ray(S, dir, R);
    const T = h ? hybrid(t, h, R, vW, vR, tDest)
                : hp(pts[dest][0]-S[0], pts[dest][1]-S[1]) / vW;
    if (T < best) { best=T; bTh=th; }
  }
  return bTh;
}

/* ===== Time terrain (with road “valleys”) ===== */
function terrain(pts, tDest, vW, vR, R, N) {
  const ax=[...Array(N).keys()].map(i=>i*BOX/(N-1));
  const Z=Array.from({length:N},()=>Array(N));
  for (let ix=0; ix<N; ix++) for (let iy=0; iy<N; iy++) {
    const x=ax[ix], y=ax[iy];
    // direct to dest
    let best = hp(x-pts[0][0], y-pts[0][1]) / vW;
    // via POIs
    for (let p=0; p<pts.length; p++) {
      if (!isFinite(tDest[p])) continue;
      const c = hp(x-pts[p][0], y-pts[p][1]) / vW + tDest[p];
      if (c < best) best = c;
    }
    // via any point along each road
    for (const e of R) {
      const P=e.p, Q=e.q, v=[Q[0]-P[0], Q[1]-P[1]];
      const len2 = v[0]*v[0] + v[1]*v[1];
      if (!len2) continue;
      let w=((x-P[0])*v[0] + (y-P[1])*v[1]) / len2;
      w = Math.max(0, Math.min(1, w));
      const xp=P[0]+w*v[0], yp=P[1]+w*v[1];
      const walk = hp(x-xp, y-yp) / vW;
      const dProj = w * e.d, dRem = e.d - dProj;
      const bestEdge = Math.min(dProj/vR + tDest[e.i], dRem/vR + tDest[e.j]);
      best = Math.min(best, walk + bestEdge);
    }
    Z[iy][ix] = best;
  }
  return { ax, Z };
}

/* ===== Plot helpers ===== */
function srf(id, t, titleText) {
  Plotly.newPlot(id, [{
    z:t.Z, x:t.ax, y:t.ax, type:'surface', colorscale:'Turbo', showscale:false
  }], {
    title: titleText,
    font:{color:'#eee'},
    scene:{xaxis:{title:'x'}, yaxis:{title:'y'}, zaxis:{title:'t'}},
    paper_bgcolor:'#111', plot_bgcolor:'#111'
  }, {responsive:true});
}
function map(id, S, pts, R, pathL, pathF, nk) {
  const tr=[];
  // roads
  R.forEach(e => tr.push({x:[e.p[0],e.q[0]], y:[e.p[1],e.q[1]], mode:'lines',
                          line:{color:'#777',width:1}, opacity:.35, showlegend:false, hoverinfo:'skip'}));
  // unknown POIs
  const unk=[...Array(pts.length).keys()].slice(nk);
  if (unk.length) tr.push({x:unk.map(i=>pts[i][0]), y:unk.map(i=>pts[i][1]), mode:'markers',
                           marker:{symbol:'circle-open',size:10,color:'#2ecc71'}, name:'Unknown'});
  // points & paths
  tr.push(
    {x:[pts[0][0]], y:[pts[0][1]], mode:'markers', marker:{symbol:'diamond',size:12,color:'#3498db'}, name:'Dest'},
    {x:[S[0]],      y:[S[1]],      mode:'markers', marker:{symbol:'square', size:12,color:'#e74c3c'}, name:'Start'},
    {x:pathL.map(p=>p[0]), y:pathL.map(p=>p[1]), mode:'lines', line:{width:3,color:'#e91e63'}, name:'Limited'},
    {x:pathF.map(p=>p[0]), y:pathF.map(p=>p[1]), mode:'lines', line:{width:3,color:'#00e5ff'}, name:'Full'}
  );
  Plotly.newPlot(id, tr, {
    title:'World',
    font:{color:'#eee'},
    xaxis:{range:[0,BOX], fixedrange:true},
    yaxis:{range:[0,BOX], scaleanchor:'x', fixedrange:true},
    paper_bgcolor:'#111', plot_bgcolor:'#111'
  }, {responsive:true});
}

/* ===== Run driver ===== */
async function run() {
  btn.disabled = true;

  const nk = +nkInp.value, nu = +nuInp.value, vW = +vwInp.value, vR = +vrInp.value, N = +gNInp.value;
  const S = randPt(BOX);
  const pts = Array.from({length:nk+nu}, () => randPt(BOX));
  const dest = 0;

  const lim = net([...Array(nk).keys()], pts, vR);
  const ful = net([...Array(pts.length).keys()], pts, vR);

  const tF = floyd(ful.W).map(r => r[dest]);
  const tL = floyd(lim.W).map(r => r[dest]).concat(Array(nu).fill(Infinity));

  const thL = optHead(S, lim.r, pts, vW, vR, dest, tL);
  const thF = optHead(S, ful.r, pts, vW, vR, dest, tF);

  const dirL=[Math.cos(thL), Math.sin(thL)];
  const dirF=[Math.cos(thF), Math.sin(thF)];

  const hitL = ray(S, dirL, lim.r).h || [S[0]+dirL[0]*50, S[1]+dirL[1]*50];
  const hitF = ray(S, dirF, ful.r).h || [S[0]+dirF[0]*50, S[1]+dirF[1]*50];

  srf('tLim',  terrain(pts, tL, vW, vR, lim.r, N),  'Limited');
  srf('tFull', terrain(pts, tF, vW, vR, ful.r, N), 'Full');
  map('world', S, pts, ful.r, [S, hitL], [S, hitF], nk);

  btn.disabled = false;
}

/* DOM wires */
const nkInp = document.getElementById('nk');
const nuInp = document.getElementById('nu');
const vwInp = document.getElementById('vw');
const vrInp = document.getElementById('vr');
const gNInp = document.getElementById('gN');
const btn   = document.getElementById('run');

btn.addEventListener('click', () => {
  try { run(); } catch (e) { console.error(e); btn.disabled=false; }
});

// Optional: auto-run once on load
document.addEventListener('DOMContentLoaded', () => { try { run(); } catch(e) { console.error(e); } });
</script>

<style>
body { background:#111; color:#eee; }
h1, h2, h3 { color:#eee; }
</style>
```

## File: _projects/tetris.html

```
---
layout: default
title: "Tetris"
permalink: /projects/tetris/
---

<style>
  :root {
    /* Mobile controls configuration */
    --das: 130ms;
    --arr: 45ms;
    --btn-pad: 16px;
    --gap: 10px;
    --accent: #3f51b5;
    --bg-dark: #0b0b0b;
    --fg-light: #eaeaea;
    --surface: #1b1b1b;
  }

  /* Prevent overscroll on mobile */
  body {
    overscroll-behavior: none;
    -webkit-overflow-scrolling: touch;
  }

  #tetris-wrap {
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 10px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom));
  }

  #tetris {
    background: #111;
    border: 1px solid #333;
    border-radius: 8px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
    touch-action: none; /* Prevent scroll on canvas */
  }

  /* Mobile game container */
  .mobile-game-container {
    display: none;
  }

  /* Compact mobile info bar */
  .mobile-info-bar {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    background: var(--surface);
    border: 1px solid #333;
    border-radius: 8px;
    padding: 8px 12px;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .mobile-info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .mobile-info-label {
    font-size: 10px;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .mobile-info-value {
    font-weight: 700;
    font-size: 14px;
  }

  .mobile-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .mobile-preview canvas {
    width: 40px;
    height: 40px;
    background: #0a0a0a;
    border: 1px solid #222;
    border-radius: 4px;
  }

  /* Mobile-specific styles */
  .mobile-btn {
    background: var(--surface);
    border: 2px solid #333;
    border-radius: 16px;
    padding: 0;
    text-align: center;
    font-size: 1.1rem;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    color: var(--fg-light);
    cursor: pointer;
    min-height: 60px;
    min-width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    transition: transform 0.05s, box-shadow 0.05s;
    box-shadow: 0 4px 0 rgba(0,0,0,0.3);
  }

  .mobile-btn:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 rgba(0,0,0,0.3);
  }

  .mobile-btn.rotate {
    background: linear-gradient(135deg, #5e35b1 0%, #7e57c2 100%);
    border-color: #4527a0;
    box-shadow: 0 4px 0 #4527a0;
  }

  .mobile-btn.drop {
    background: linear-gradient(135deg, #c2185b 0%, #e91e63 100%);
    border-color: #ad1457;
    box-shadow: 0 4px 0 #ad1457;
    font-size: 0.9rem;
  }

  .mobile-btn.hold {
    background: linear-gradient(135deg, #ef6c00 0%, #fb8c00 100%);
    border-color: #e65100;
    box-shadow: 0 4px 0 #e65100;
    font-size: 0.9rem;
  }

  .mobile-btn.move {
    background: linear-gradient(135deg, #2e7d32 0%, #43a047 100%);
    border-color: #1b5e20;
    box-shadow: 0 4px 0 #1b5e20;
    font-size: 1.5rem;
  }

  .mobile-btn.utility {
    background: var(--surface);
    border-color: #444;
    box-shadow: 0 4px 0 #222;
    font-size: 0.85rem;
  }

  /* Mobile controls layout */
  .mobile-controls-wrapper {
    display: none;
    width: 100%;
    max-width: 600px;
  }

  .mobile-controls-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    width: 100%;
  }

  /* Movement buttons span left side */
  .mobile-btn.move-left {
    grid-column: 1;
  }

  .mobile-btn.move-right {
    grid-column: 2;
  }

  /* Action buttons on right side */
  .mobile-btn.action-rotate {
    grid-column: 3;
  }

  .mobile-btn.action-drop {
    grid-column: 4;
  }

  /* Second row utilities */
  .mobile-controls-utilities {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 10px;
  }

  /* Show mobile controls only on small screens */
  @media (max-width: 768px) {
    /* Hide desktop sidebar */
    #tetris-wrap > div[style*="min-width:240px"] {
      display: none;
    }

    /* Show mobile container */
    .mobile-game-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 100vw;
      padding: max(8px, env(safe-area-inset-top)) max(8px, env(safe-area-inset-right)) max(8px, env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-left));
      box-sizing: border-box;
    }

    .mobile-controls-wrapper {
      display: block;
    }

    #tetris-wrap {
      flex-direction: column;
      align-items: center;
      padding: 0;
      gap: 0;
    }

    #mobile-controls-legacy {
      display: none;
    }

    #tetris {
      width: 100%;
      max-width: 100%;
      border-radius: 12px;
      margin-bottom: 12px;
    }
  }

  /* Landscape optimization for mobile */
  @media (max-width: 768px) and (orientation: landscape) {
    .mobile-game-container {
      flex-direction: row;
      gap: 10px;
      align-items: center;
      padding: max(6px, env(safe-area-inset-top)) max(6px, env(safe-area-inset-right)) max(6px, env(safe-area-inset-bottom)) max(6px, env(safe-area-inset-left));
    }

    #tetris {
      max-width: 55%;
      max-height: calc(100vh - 16px);
      margin-bottom: 0;
    }

    .mobile-controls-wrapper {
      max-width: 40%;
      flex: 1;
    }

    .mobile-btn {
      min-height: 50px;
      min-width: 50px;
      font-size: 1rem;
    }

    .mobile-info-bar {
      padding: 6px 8px;
      font-size: 12px;
    }

    .mobile-info-value {
      font-size: 12px;
    }
  }

  /* Extra small screens - optimize button sizes */
  @media (max-width: 360px) {
    .mobile-btn {
      min-height: 56px;
      min-width: 56px;
      font-size: 1rem;
    }

    .mobile-controls-grid {
      gap: 8px;
    }

    .mobile-controls-utilities {
      gap: 8px;
    }
  }

  /* Larger tablets and desktops - keep original desktop layout */
  @media (min-width: 769px) {
    .mobile-controls-wrapper {
      display: none;
    }

    .mobile-game-container {
      display: none;
    }
  }

  /* Fullscreen mode styles */
  #tetris-wrap:fullscreen,
  #tetris-wrap:-webkit-full-screen,
  #tetris-wrap:-moz-full-screen,
  #tetris-wrap:-ms-fullscreen {
    background: var(--bg-dark);
    width: 100vw;
    height: 100vh;
    padding: 10px;
  }

  #tetris-wrap:fullscreen .mobile-game-container,
  #tetris-wrap:-webkit-full-screen .mobile-game-container,
  #tetris-wrap:-moz-full-screen .mobile-game-container,
  #tetris-wrap:-ms-fullscreen .mobile-game-container {
    display: flex !important;
    height: 100%;
    max-width: 100%;
  }

  #tetris-wrap:fullscreen .mobile-controls-wrapper,
  #tetris-wrap:-webkit-full-screen .mobile-controls-wrapper,
  #tetris-wrap:-moz-full-screen .mobile-controls-wrapper,
  #tetris-wrap:-ms-fullscreen .mobile-controls-wrapper {
    display: block !important;
  }

  /* Fullscreen portrait */
  @media (max-width: 768px) and (orientation: portrait) {
    #tetris-wrap:fullscreen .mobile-game-container,
    #tetris-wrap:-webkit-full-screen .mobile-game-container,
    #tetris-wrap:-moz-full-screen .mobile-game-container,
    #tetris-wrap:-ms-fullscreen .mobile-game-container {
      flex-direction: column;
      justify-content: space-between;
    }

    #tetris-wrap:fullscreen #tetris,
    #tetris-wrap:-webkit-full-screen #tetris,
    #tetris-wrap:-moz-full-screen #tetris,
    #tetris-wrap:-ms-fullscreen #tetris {
      max-height: 60vh;
      margin-bottom: 10px;
    }
  }

  /* Fullscreen landscape */
  @media (max-width: 768px) and (orientation: landscape) {
    #tetris-wrap:fullscreen .mobile-game-container,
    #tetris-wrap:-webkit-full-screen .mobile-game-container,
    #tetris-wrap:-moz-full-screen .mobile-game-container,
    #tetris-wrap:-ms-fullscreen .mobile-game-container {
      flex-direction: row;
    }
  }
</style>

<div id="tetris-wrap">
  <!-- Desktop layout (shown on large screens) -->
  <canvas id="tetris"></canvas>
  <div style="min-width:240px">
    <h2 style="margin:0 0 8px">Tetris</h2>
    <div id="score" style="font:600 18px/1 system-ui;padding:8px 12px;border:1px solid #333;border-radius:8px;background:#1a1a1a">Score: 0</div>
    <div id="level" style="margin-top:8px;font:600 16px/1 system-ui;padding:8px 12px;border:1px solid #333;border-radius:8px;background:#1a1a1a">Level: 1</div>

    <div style="margin-top:8px">
      <label style="font:600 14px system-ui">Name/Initials</label>
      <input id="name" maxlength="16" placeholder="YOU"
             style="width:100%;padding:6px 8px;background:#111;border:1px solid #333;border-radius:6px;color:#ddd;"/>
    </div>

    <div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div>
        <div style="font:600 14px system-ui;margin:4px 0">Next</div>
        <canvas id="next" width="120" height="120" style="background:#111;border:1px solid #333;border-radius:8px"></canvas>
      </div>
      <div>
        <div style="font:600 14px system-ui;margin:4px 0">Hold</div>
        <canvas id="hold" width="120" height="120" style="background:#111;border:1px solid #333;border-radius:8px"></canvas>
      </div>
    </div>

    <details style="margin-top:12px">
      <summary>Controls</summary>
      <div style="font:14px/1.4 system-ui;margin-top:6px">
        ←/→ move • ↓ soft • ↑/X cw • Z ccw • <b>C/Shift hold</b> • Space hard • P pause • R restart
      </div>
    </details>

    <!-- Legacy mobile controls (hidden on mobile, shown on desktop for backwards compat) -->
    <div id="mobile-controls-legacy" style="margin-top:12px;padding:12px;background:#1a1a1a;border:1px solid #333;border-radius:8px">
      <div style="font:600 14px system-ui;margin-bottom:8px;text-align:center">Quick Controls</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px">
        <button id="btn-rotate-ccw-legacy" style="padding:12px;background:#3f51b5;border:none;border-radius:6px;color:#fff;font:600 14px system-ui;cursor:pointer;touch-action:manipulation">↺ CCW</button>
        <button id="btn-rotate-cw-legacy" style="padding:12px;background:#3f51b5;border:none;border-radius:6px;color:#fff;font:600 14px system-ui;cursor:pointer;touch-action:manipulation">↻ CW</button>
        <button id="btn-hold-legacy" style="padding:12px;background:#fb8c00;border:none;border-radius:6px;color:#fff;font:600 14px system-ui;cursor:pointer;touch-action:manipulation">Hold</button>
      </div>
      <button id="btn-fullscreen-legacy" style="width:100%;padding:12px;background:#7e57c2;border:none;border-radius:6px;color:#fff;font:600 14px system-ui;cursor:pointer;touch-action:manipulation">⛶ Fullscreen</button>
    </div>

    <div style="margin-top:14px">
      <div style="font:600 14px system-ui;margin:4px 0">Leaderboard (Top 10)</div>
      <ol id="lb" style="margin:6px 0 0;padding-left:22px;font:14px/1.4 system-ui"></ol>
    </div>
  </div>

  <!-- Mobile layout (shown on small screens) -->
  <div class="mobile-game-container">
    <!-- Mobile info bar (compact) -->
    <div style="width: 100%;">
      <div class="mobile-info-bar">
        <div class="mobile-info-item">
          <div class="mobile-info-label">Score</div>
          <div class="mobile-info-value" id="score-mobile">0</div>
        </div>
        <div class="mobile-info-item">
          <div class="mobile-info-label">Level</div>
          <div class="mobile-info-value" id="level-mobile">1</div>
        </div>
        <div class="mobile-preview">
          <div class="mobile-info-label">Next</div>
          <canvas id="next-mobile" width="60" height="60"></canvas>
        </div>
        <div class="mobile-preview">
          <div class="mobile-info-label">Hold</div>
          <canvas id="hold-mobile" width="60" height="60"></canvas>
        </div>
      </div>
    </div>

    <!-- New simplified mobile controls -->
    <div class="mobile-controls-wrapper">
      <!-- Main controls -->
      <div class="mobile-controls-grid">
        <button class="mobile-btn move move-left" id="btn-left-mobile">◀</button>
        <button class="mobile-btn move move-right" id="btn-right-mobile">▶</button>
        <button class="mobile-btn rotate action-rotate" id="btn-rotate-mobile">⟳</button>
        <button class="mobile-btn drop action-drop" id="btn-drop-mobile">DROP</button>
      </div>

      <!-- Utility buttons -->
      <div class="mobile-controls-utilities">
        <button class="mobile-btn hold" id="btn-hold-mobile">HOLD</button>
        <button class="mobile-btn utility" id="btn-pause-mobile">PAUSE</button>
        <button class="mobile-btn utility" id="btn-fullscreen-mobile">⛶</button>
      </div>
    </div>
  </div>
</div>

<script>
(() => {
  // --- API ---
  const API_URL = "https://subscriber-api-lolroxs.vercel.app/api/tetris";

  // --- Config ---
  const W=10, H=20;
  const CLEAR_MS=320, CLEAR_BLINKS=3;
  const BASE_DROP=1000, MIN_DROP=90, SPEED_STEP=80;
  const COLORS={ I:"#00e5ff", O:"#ffd500", T:"#e91e63", S:"#43a047", Z:"#ef5350", J:"#3f51b5", L:"#fb8c00" };
  const SHAPES={
    I:{c:"I",m:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]]},
    O:{c:"O",m:[[1,1],[1,1]]},
    T:{c:"T",m:[[1,1,1],[0,1,0],[0,0,0]]},
    S:{c:"S",m:[[0,1,1],[1,1,0],[0,0,0]]},
    Z:{c:"Z",m:[[1,1,0],[0,1,1],[0,0,0]]},
    J:{c:"J",m:[[1,0,0],[1,1,1],[0,0,0]]},
    L:{c:"L",m:[[0,0,1],[1,1,1],[0,0,0]]},
  };
  const BAG = () => Object.values(SHAPES).map(s=>s).sort(()=>Math.random()-0.5);

  // --- Canvas ---
  const cvs=document.getElementById("tetris"), ctx=cvs.getContext("2d");
  const ncv=document.getElementById("next"), nctx=ncv.getContext("2d");
  const hcv=document.getElementById("hold"), hctx=hcv.getContext("2d");

  // Mobile canvases
  const ncvMobile=document.getElementById("next-mobile"), nctxMobile=ncvMobile?.getContext("2d");
  const hcvMobile=document.getElementById("hold-mobile"), hctxMobile=hcvMobile?.getContext("2d");

  function resize(){
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile: maximize canvas size
      const containerWidth = Math.min(window.innerWidth - 16, 600);
      const containerHeight = window.innerHeight;

      // Calculate cell size to fit screen nicely
      const cellByWidth = Math.floor(containerWidth / W);
      const cellByHeight = Math.floor((containerHeight * 0.6) / H); // Use 60% of height for canvas
      const cell = Math.max(18, Math.min(cellByWidth, cellByHeight, 32));

      cvs.width = cell * W;
      cvs.height = cell * H;
      CELL = cell;
    } else {
      // Desktop: original sizing
      const maxW = Math.min(document.getElementById("tetris-wrap").clientWidth - 260, 520);
      const cell = Math.max(16, Math.floor(Math.min(maxW, 520) / W));
      cvs.width = cell * W;
      cvs.height = cell * H;
      CELL = cell;
    }
  }
  let CELL=26; resize(); addEventListener("resize", resize);

  // --- State ---
  let board=Array.from({length:H},()=>Array(W).fill(0));
  let piece=null, bag=BAG(), nextPiece=bag.pop();
  let holdPiece=null, canHold=true;
  let score=0, level=1, dropTimer=0, last=0, paused=false, over=false, clearing=null, didSave=false;
  const scoreEl=document.getElementById("score"), levelEl=document.getElementById("level"),
        lbEl=document.getElementById("lb"), nameInp=document.getElementById("name");

  // Mobile elements
  const scoreMobileEl=document.getElementById("score-mobile");
  const levelMobileEl=document.getElementById("level-mobile");

  // Update score/level for both desktop and mobile
  function updateScore() {
    const scoreText = score.toString();
    const levelText = level.toString();
    if (scoreEl) scoreEl.textContent = "Score: " + scoreText;
    if (levelEl) levelEl.textContent = "Level: " + levelText;
    if (scoreMobileEl) scoreMobileEl.textContent = scoreText;
    if (levelMobileEl) levelMobileEl.textContent = levelText;
  }

  const clone = m => m.map(r=>r.slice());
  function levelFromScore(s){ return 1 + Math.floor(s/500); }
  function dropInterval() {
    const decay = 0.88; // smaller = slower acceleration per level
    return Math.max(MIN_DROP, BASE_DROP * Math.pow(decay, level - 1));
  }
  function rotateCW(m){ const N=m.length, r=Array.from({length:N},()=>Array(N).fill(0)); for(let y=0;y<N;y++) for(let x=0;x<N;x++) r[x][N-1-y]=m[y][x]; return r; }
  function rotateCCW(m){ const N=m.length, r=Array.from({length:N},()=>Array(N).fill(0)); for(let y=0;y<N;y++) for(let x=0;x<N;x++) r[N-1-x][y]=m[y][x]; return r; }
  function collide(px,py,mat){
    for(let y=0;y<mat.length;y++) for(let x=0;x<mat[y].length;x++){
      if(!mat[y][x]) continue; const X=px+x, Y=py+y;
      if(X<0||X>=W||Y>=H) return true;
      if(Y>=0 && board[Y][X]) return true;
    } return false;
  }
  function merge(px,py,mat,c){ for(let y=0;y<mat.length;y++) for(let x=0;x<mat[y].length;x++){ if(!mat[y][x]) continue; const X=px+x,Y=py+y; if(Y>=0) board[Y][X]=c; } }

  // --- Mini renders ---
  function drawMini(ctx, cv, shape){
    ctx.clearRect(0,0,cv.width,cv.height);
    if (!shape) { ctx.fillStyle="#0a0a0a"; ctx.fillRect(0,0,cv.width,cv.height); return; }
    const m = SHAPES[shape.c].m, size = Math.max(m.length, m[0].length);
    const cell = Math.floor(Math.min(cv.width, cv.height)/(size+1));
    const ox = Math.floor((cv.width - cell*m[0].length)/2);
    const oy = Math.floor((cv.height - cell*m.length)/2);
    ctx.fillStyle="#0a0a0a"; ctx.fillRect(0,0,cv.width,cv.height);
    for(let y=0;y<m.length;y++) for(let x=0;x<m[y].length;x++){
      if(!m[y][x]) continue; ctx.fillStyle=COLORS[shape.c];
      ctx.fillRect(ox + x*cell +1, oy + y*cell +1, cell-2, cell-2);
    }
  }

  const drawNext=()=>{
    drawMini(nctx,ncv,nextPiece);
    if (nctxMobile) drawMini(nctxMobile,ncvMobile,nextPiece);
  };

  const drawHold=()=>{
    drawMini(hctx,hcv,holdPiece);
    if (hctxMobile) drawMini(hctxMobile,hcvMobile,holdPiece);
  };

  // --- Piece flow ---
  function spawn(){
    piece = { x:3, y:-2, m:clone(nextPiece.m), c: nextPiece.c };
    if (bag.length===0) bag=BAG();
    nextPiece = bag.pop();
    canHold=true; drawNext(); drawHold();
    if (collide(piece.x, piece.y, piece.m)) { over=true; }
  }
  function hold(){
    if (!canHold || !piece || clearing || over) return;
    const current = { c: piece.c, m: clone(piece.m) };
    if (!holdPiece){ holdPiece = current; spawn(); }
    else { const swap = holdPiece; holdPiece=current; piece={ x:3, y:-2, m:clone(swap.m), c:swap.c }; if (collide(piece.x,piece.y,piece.m)) over=true; }
    canHold=false; drawHold();
  }

  // --- Draw ---
  function drawCell(x,y,c,ghost=false){
    const px=x*CELL, py=y*CELL;
    ctx.fillStyle=ghost? "#ffffff22" : COLORS[c];
    ctx.fillRect(px+1, py+1, CELL-2, CELL-2);
    if(!ghost){ ctx.fillStyle="#00000022"; ctx.fillRect(px+1, py+CELL-6, CELL-2, 5); }
  }
  function overlay(text){
    ctx.fillStyle="rgba(0,0,0,.6)"; ctx.fillRect(0,0,cvs.width,cvs.height);
    ctx.fillStyle="#eee"; ctx.font="600 18px system-ui"; ctx.textAlign="center";
    ctx.fillText(text, cvs.width/2, cvs.height/2);
  }
  function drawBoard(now){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    ctx.strokeStyle="#222"; ctx.lineWidth=1;
    for(let x=0;x<=W;x++){ ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,H*CELL); ctx.stroke(); }
    for(let y=0;y<=H;y++){ ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(W*CELL,y*CELL); ctx.stroke(); }

    for(let y=0;y<H;y++) for(let x=0;x<W;x++){
      if(!board[y][x]) continue;
      let flashing=false;
      if (clearing && clearing.rows.includes(y)){
        const prog = (now - clearing.t0) / (CLEAR_MS / CLEAR_BLINKS);
        flashing = Math.floor(prog)%2===0;
      }
      if (clearing && clearing.rows.includes(y) && flashing){
        ctx.fillStyle="#fff"; ctx.fillRect(x*CELL+1, y*CELL+1, CELL-2, CELL-2);
      } else drawCell(x,y,board[y][x]);
    }

    if (piece && !clearing){
      let gy=piece.y; while(!collide(piece.x, gy+1, piece.m)) gy++;
      for(let y=0;y<piece.m.length;y++) for(let x=0;x<piece.m[y].length;x++){
        if(piece.m[y][x] && gy+y>=0) drawCell(piece.x+x, gy+y, piece.c, true);
      }
      for(let y=0;y<piece.m.length;y++) for(let x=0;x<piece.m[y].length;x++){
        if(piece.m[y][x] && piece.y+y>=0) drawCell(piece.x+x, piece.y+y, piece.c);
      }
    }
    if (paused && !over) overlay("PAUSED");
    if (over) overlay("GAME OVER  (R to restart)");
  }

  // --- Clears / scoring ---
  function checkClears(){
    const rows=[]; for(let y=0;y<H;y++) if(board[y].every(v=>v)) rows.push(y);
    if(rows.length){
      const add=[0,100,300,500,800][rows.length]||0; score+=add;
      clearing={rows, t0:performance.now()};
      return true;
    } return false;
  }
  function applyClears(){
    clearing.rows.sort((a,b)=>a-b).forEach(y=>{ board.splice(y,1); board.unshift(Array(W).fill(0)); });
    clearing=null; level = levelFromScore(score);
    updateScore();
  }

  // --- Lock / game over ---
  function lock(){
    let aboveTop=false;
    for(let y=0;y<piece.m.length;y++) for(let x=0;x<piece.m[y].length;x++){
      if(!piece.m[y][x]) continue;
      const X=piece.x+x, Y=piece.y+y;
      if (Y<0) { aboveTop=true; continue; }
      board[Y][X]=piece.c;
    }
    piece=null;
    if (aboveTop){ over=true; saveScoreOnce(); return; }
    if (!checkClears()) spawn();
    updateScore();
  }

  // --- Moves ---
  function hardDrop(){ if(!piece||clearing) return; let d=0; while(!collide(piece.x,piece.y+1,piece.m)){ piece.y++; d++; } score+=d*2; lock(); }
  function softDrop(){ if(!piece||clearing) return; if(!collide(piece.x,piece.y+1,piece.m)){ piece.y++; score+=1; } else lock(); }
  function rot(dir){
    if (!piece) return;
    const m0=piece.m; let m= dir>0? rotateCW(m0) : rotateCCW(m0);
    if (piece.c==="O") return;
    const kicks=[[0,0],[-1,0],[1,0],[0,-1],[0,1]];
    for (const [kx,ky] of kicks){ if(!collide(piece.x+kx,piece.y+ky,m)){ piece.x+=kx; piece.y+=ky; piece.m=m; return; } }
  }

  // --- Controls ---
  addEventListener("keydown", e=>{
    if (e.repeat) return;
    if (over){ if (e.code==="KeyR") reset(); return; }
    if (e.code==="KeyP"){ paused=!paused; return; }
    if (paused || clearing) return;

    if (e.code==="ArrowLeft"){ if(!collide(piece.x-1,piece.y,piece.m)) piece.x--; }
    else if (e.code==="ArrowRight"){ if(!collide(piece.x+1,piece.y,piece.m)) piece.x++; }
    else if (e.code==="ArrowDown"){ softDrop(); }
    else if (e.code==="Space"){ hardDrop(); }
    else if (e.code==="ArrowUp" || e.code==="KeyX"){ rot(1); }
    else if (e.code==="KeyZ"){ rot(-1); }
    else if (e.code==="KeyC" || e.code==="ShiftLeft" || e.code==="ShiftRight"){ hold(); }
  });

  // --- Mobile Controls: DAS/ARR Auto-Repeat ---
  const V = (ms) => navigator.vibrate?.(ms); // Optional haptic feedback

  // Auto-repeat binding with DAS (Delayed Auto Shift) and ARR (Auto Repeat Rate)
  function bindRepeat(el, action, { das = 130, arr = 45 } = {}) {
    if (!el) return;
    let timeout = null, interval = null;

    const down = (e) => {
      e.preventDefault();
      action(); // Execute immediately
      V(5); // Short vibration
      // Start auto-repeat after DAS delay
      timeout = setTimeout(() => {
        interval = setInterval(action, arr);
      }, das);
    };

    const up = () => {
      clearTimeout(timeout);
      clearInterval(interval);
      timeout = interval = null;
    };

    el.addEventListener('pointerdown', down, { passive: false });
    el.addEventListener('pointerup', up);
    el.addEventListener('pointerleave', up);
    el.addEventListener('pointercancel', up);
  }

  // Single-press bindings (no repeat)
  function bindSingle(el, action) {
    if (!el) return;
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      action();
      V(8); // Slightly longer vibration for actions
    }, { passive: false });
  }

  // New mobile controls
  bindRepeat(document.getElementById('btn-left-mobile'), () => {
    if (paused || clearing || over || !piece) return;
    if (!collide(piece.x - 1, piece.y, piece.m)) piece.x--;
  });

  bindRepeat(document.getElementById('btn-right-mobile'), () => {
    if (paused || clearing || over || !piece) return;
    if (!collide(piece.x + 1, piece.y, piece.m)) piece.x++;
  });

  bindSingle(document.getElementById('btn-rotate-mobile'), () => {
    if (paused || clearing || over || !piece) return;
    rot(1);
  });

  bindSingle(document.getElementById('btn-drop-mobile'), () => {
    if (paused || clearing || over) return;
    hardDrop();
    V(18); // Strong vibration for hard drop
  });

  bindSingle(document.getElementById('btn-hold-mobile'), () => {
    if (paused || clearing || over) return;
    hold();
  });

  bindSingle(document.getElementById('btn-pause-mobile'), () => {
    if (over) return;
    paused = !paused;
  });

  // Legacy desktop quick controls
  bindSingle(document.getElementById('btn-rotate-cw-legacy'), () => {
    if (paused || clearing || over || !piece) return;
    rot(1);
  });

  bindSingle(document.getElementById('btn-rotate-ccw-legacy'), () => {
    if (paused || clearing || over || !piece) return;
    rot(-1);
  });

  bindSingle(document.getElementById('btn-hold-legacy'), () => {
    if (paused || clearing || over) return;
    hold();
  });

  // --- Fullscreen ---
  const wrapEl = document.getElementById('tetris-wrap');
  const fsBtnMobile = document.getElementById('btn-fullscreen-mobile');
  const fsBtnLegacy = document.getElementById('btn-fullscreen-legacy');

  function updateFullscreenButtons() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
    const textMobile = isFullscreen ? '✕' : '⛶';
    const textLegacy = isFullscreen ? '⛶ Exit Fullscreen' : '⛶ Fullscreen';
    if (fsBtnMobile) fsBtnMobile.textContent = textMobile;
    if (fsBtnLegacy) fsBtnLegacy.textContent = textLegacy;
  }

  function toggleFullscreen() {
    const elem = wrapEl;

    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement) {
      // Enter fullscreen
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  // Listen for fullscreen changes (including ESC key)
  document.addEventListener('fullscreenchange', () => {
    updateFullscreenButtons();
    setTimeout(resize, 100); // Resize canvas after fullscreen transition
  });
  document.addEventListener('webkitfullscreenchange', () => {
    updateFullscreenButtons();
    setTimeout(resize, 100);
  });
  document.addEventListener('mozfullscreenchange', () => {
    updateFullscreenButtons();
    setTimeout(resize, 100);
  });

  // Bind fullscreen buttons
  bindSingle(fsBtnMobile, toggleFullscreen);
  bindSingle(fsBtnLegacy, toggleFullscreen);

  // --- Leaderboard (global) ---
  function renderLeaderboard(list){
    lbEl.innerHTML = (list||[]).slice(0,10).map((e,i)=>`<li>#${i+1} ${e.name} — ${e.score}</li>`).join("") || "<li>No scores yet</li>";
  }
  async function fetchLeaderboard(){
    try { const r=await fetch(API_URL,{method:"GET",mode:"cors"}); const j=await r.json(); renderLeaderboard(j.leaderboard); }
    catch {}
  }
  async function submitScoreGlobal(){
    const name = (nameInp?.value || localStorage.getItem("tetris_name") || "YOU").slice(0,16);
    localStorage.setItem("tetris_name", name);
    try {
      const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,score}),mode:"cors"});
      const j=await r.json(); if (j.leaderboard) renderLeaderboard(j.leaderboard);
    } catch {}
  }
  function saveScoreOnce(){ if (didSave) return; didSave=true; if (score>0) submitScoreGlobal(); }

  // --- Loop / reset ---
  function step(t){
    const dt=t-last; last=t;
    if (!paused && !over){
      if (clearing){ if (t-clearing.t0 >= CLEAR_MS*CLEAR_BLINKS){ applyClears(); spawn(); dropTimer=0; } }
      else { dropTimer+=dt; if (dropTimer >= dropInterval()){ if(!collide(piece.x,piece.y+1,piece.m)) piece.y++; else lock(); dropTimer=0; } }
    } else if (over){ saveScoreOnce(); }
    drawBoard(t);
    requestAnimationFrame(step);
  }
  function reset(){
    board=Array.from({length:H},()=>Array(W).fill(0));
    score=0; level=1; over=false; paused=false; clearing=null; didSave=false;
    bag=BAG(); nextPiece=bag.pop(); holdPiece=null; canHold=true;
    updateScore();
    const saved = localStorage.getItem("tetris_name") || "YOU"; if (nameInp) nameInp.value = saved;
    fetchLeaderboard(); spawn();
  }

  reset(); requestAnimationFrame(step);
})();
</script>
```

## File: _projects/three-body-simulation.html

```
---
title: "3-Body Simulation"
layout: default
permalink: /projects/three-body-simulation/
---

<div id="three-body-sim">
  <h2>3-Body Simulation</h2>
</div>

<script src="https://cdn.jsdelivr.net/npm/p5@1.4.2/lib/p5.min.js"></script>
<script>
let bodies = [];
let resetThreshold = 800; // distance beyond which we reset
let resetButton;
let cnv;

function setup() {
  // Create responsive canvas
  createOrResizeCanvas();

  // Create a button in normal HTML flow (no absolute positioning)
  resetButton = createButton('Reset Simulation');
  resetButton.parent('three-body-sim');
  resetButton.mousePressed(resetSimulation);

  resetSimulation();
}

function createOrResizeCanvas() {
  const container = document.getElementById('three-body-sim');
  const maxW = Math.min((container?.clientWidth || 600), 800);
  const w = Math.max(300, maxW);
  const h = Math.round(w * 0.6); // maintain aspect ratio

  if (!cnv) {
    cnv = createCanvas(w, h);
    cnv.parent('three-body-sim');
  } else {
    resizeCanvas(w, h);
  }

  // Adjust reset threshold based on canvas size
  resetThreshold = Math.max(w, h) * 1.5;
}

function windowResized() {
  createOrResizeCanvas();
  // Keep existing bodies but adjust if needed
  for (let b of bodies) {
    b.pos.x = constrain(b.pos.x, 0, width);
    b.pos.y = constrain(b.pos.y, 0, height);
  }
}

function resetSimulation() {
  bodies = [];
  for (let i = 0; i < 3; i++) {
    let pos = createVector(random(width*0.3, width*0.7), random(height*0.3, height*0.7));
    let vel = createVector(random(-1, 1), random(-1, 1));
    let mass = random(10, 30);
    bodies.push(new Body(pos, vel, mass));
  }
}

function draw() {
  background(0);

  // If any body goes too far, reset
  for (let b of bodies) {
    if (
      b.pos.x < -resetThreshold || b.pos.x > width + resetThreshold ||
      b.pos.y < -resetThreshold || b.pos.y > height + resetThreshold
    ) {
      resetSimulation();
      return;
    }
  }

  // Gravity between pairs
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      applyGravity(bodies[i], bodies[j]);
    }
  }

  // Update & draw bodies
  for (let b of bodies) {
    b.update();
    b.show();
  }
}

function applyGravity(b1, b2) {
  let G = 1;
  let r = p5.Vector.sub(b2.pos, b1.pos);
  let distSq = constrain(r.magSq(), 10, 50000);
  let forceMag = (G * b1.mass * b2.mass) / distSq;
  let force = r.setMag(forceMag);
  b1.applyForce(force);
  b2.applyForce(force.mult(-1));
}

class Body {
  constructor(pos, vel, mass) {
    this.pos = pos;
    this.vel = vel;
    this.acc = createVector(0, 0);
    this.mass = mass;
  }
  applyForce(f) {
    let a = p5.Vector.div(f, this.mass);
    this.acc.add(a);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  show() {
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.mass, this.mass);
  }
}
</script>
```

## File: _timeline/2006-05-27-birth.md

```
---
date: 2006-05-27
title: "My Birth"
summary: "Kinda Anti-Climactic"
details: "The taxi driver who took my parents home was also named Patrick"
category: "birth"
milestone: true
people: ["Bobbi Avery", "Stephen Shaw"]
location: "Hospital/New York City"
age: 0
notes: "I was a heavy baby, 10 lbs."
---
```

## File: _timeline/2016-01-01-moved-to-ca.md

```
---
date: 2016-01-01
title: "Moved to California"
summary: "Seven Days of driving across the country for a slower life."
details: "The first time I got to try sunflower seeds and spit them into a cup, many mile counters and rows of corn."
category: "milestone"
milestone: true
people: []
location: "Davis, CA"
age: 10
notes: ""
connections: []
---
```

## File: _timeline/2017-09-09-read-three-body-problem.md

```
---
date: 2017-09-09
title: "Read The Three Body Problem"
summary: "Irreversibly changed by my favorite book series"
details: "An inspiration for so much of my life, like NEPS"
category: "creative"
milestone: false
people: ["Liu Cixin"]
location: ""
age: 12
notes: ""
---
```

## File: _timeline/2023-08-15-high-school-graduation.md

```
---
date: 2023-08-15
title: "High School Graduation"
summary: "No cap, gown, or diploma. The start of Community College"
details: "A quiet email and a free weekend before school started once again."
category: "education"
milestone: true
people: []
location: "San Luis Obispo, CA"
age: 17
notes: "A freedom"
---
```

## File: _timeline/2025-03-14-started-this-blog.md

```
---
date: 2025-03-14
title: "Started this blog"
summary: "Finally got the blog running after multiple iterations. Hosted on GitHub Pages."
details: "Went through several iterations - tried running on a Raspberry Pi, then laptop, then main PC, before finally settling on GitHub Pages. A journey in itself. This blog is a place to collect thoughts, rants, and projects."
category: "creative"
milestone: true
people: []
location: ""
age: 18
notes: "Your first blog post chronicles this whole journey. It's a milestone worth documenting!"
---
```

## File: _timeline/2025-06-22-started-college.md

```
---
date: 2025-06-22
title: "Started College at UCSC"
summary: "Some proof that I made it."
details: "A math major but no math expereince, an interesting choice."
category: "education"
milestone: true
people: []
location: "University of California Santa Cruz, CA"
age: 19
notes: ""
---
```

## File: _timeline/README.md

```
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
```

## File: encrypt/index.md

```
---
layout: post
title: Encrypt Text
permalink: /encrypt/
---

# 🧩 Encrypt Text for the Secret Section

Paste text below and enter a password.  
This page runs entirely in your browser — nothing is uploaded or stored anywhere.

<textarea id="plain" placeholder="Write or paste your text here..."></textarea><br>
<input id="pw" type="password" placeholder="Password"><br>
<button onclick="encrypt()">Encrypt</button>

<h3>Encrypted Output</h3>
<textarea id="out" readonly></textarea>

<script src="https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js"></script>
<script>
function encrypt() {
  const plain = document.getElementById('plain').value;
  const pw = document.getElementById('pw').value;
  if (!plain || !pw) {
    alert("Please enter both text and password.");
    return;
  }
  const cipher = CryptoJS.AES.encrypt(plain, pw).toString();
  document.getElementById('out').value = cipher;
}
</script>
```

## File: index.html

```
---
layout: default
---

<!-- Loop over your posts -->
{% for post in site.posts %}
  <article>
    <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
    <p>{{ post.excerpt }}</p>
  </article>
  <hr>
{% endfor %}
```

## File: legacy/chat.html

```
<!-- ---
layout: page
title: Live Chat
---

Embed Kiwi IRC Client
<iframe
  src="https://web.libera.chat/#{{ page.slug }}"
  style="border:0; width:100%; height:600px;">
</iframe>


<!-- Link to Persistent Log
<p>
  <a href="/logs/Lxsoftblogcomments.html" target="_blank">
    Click here to see past chat history.
  </a>
</p>
-->
```

## File: legacy/logs/Lxsoftblogcomments.html

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>IRC Log</title>
  <style>
    body { font-family: monospace; background-color: #111; color: #eee; padding: 20px; }
    pre { white-space: pre-wrap; }
    .timestamp { color: #888; }
  </style>
</head>
<body>
<h1>IRC Log</h1>
<pre>
**** BEGIN LOGGING AT Sun Mar 16 13:18:43 2025

Mar 16 13:18:43 *	Now talking on #Lxsoftblogcomments
**** ENDING LOGGING AT Sun Mar 16 13:19:19 2025

**** BEGIN LOGGING AT Sun Mar 16 13:19:19 2025

Mar 16 13:23:10 <Lxsoft25>	yelloooo
**** ENDING LOGGING AT Sun Mar 16 13:53:49 2025

**** BEGIN LOGGING AT Sun Mar 16 13:53:49 2025

Mar 16 13:53:53 <Lxsoft>	hiiiiih
</pre>
</body>
</html>
```

## File: secret/index.md

```
---
layout: post
title: Secrets SHHHHH
date: 2025-10-18
permalink: /secret/
---

Woah Watch Where You Click Buddy


Enter a password to view encrypted content.  


<div id="decryptor">
  <input id="pw" type="password" placeholder="Password">
  <button id="unlock">Unlock</button>
  <pre id="output"></pre>
</div>

<script src="https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js"></script>
<script>
async function decrypt() {
  const pw = document.getElementById('pw').value;
  const enc = await fetch('secret.enc').then(r => r.text());
  try {
    const bytes = CryptoJS.AES.decrypt(enc, pw);
    const text = bytes.toString(CryptoJS.enc.Utf8);
    if (!text) throw new Error();
    document.getElementById('output').textContent = text;
  } catch {
    document.getElementById('output').textContent = "Incorrect password.";
  }
}
document.getElementById('unlock').onclick = decrypt;
</script>
```

