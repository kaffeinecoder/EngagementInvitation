import picOne from "../assets/pic_one.jpeg";
import picTwo from "../assets/pic_two.png";
import picThree from "../assets/pic_three.jpeg";
import picFour from "../assets/pic_four.jpeg";
import picFive from "../assets/pic_five.png";
import videoOne from "../assets/video_one.mp4";
import picSix from "../assets/pic_six.jpeg";
import picSeven from "../assets/pic_seven.jpeg";

export const engagementData = {
	couple: { pavan: "Pavan", sanjana: "Sanjana" },
	event: {
		title: "Engagement Ceremony",
		date: "24 October 2026",
		iso: "2026-10-24T18:00:00+05:30",
		venue: "Vidya Bharati Sabha Bhavan",
		city: "Dharwad",
	},
	contacts: [
		{ name: "Pavan", phone: "8197760715" },
		{ name: "Sanjana", phone: "9353239592" },
	],
	rsvpDeadline: "15 October 2026",
} as const;

// Edit milestone text and replace imported images here without changing the layout.
export const loveStoryMilestones = [
	{
		date: "18th June 2023",
		title: "Instagram Story",
		story:
			"I replied to a story that Sanjana posted. As a connoisseur of coffee, I had to reply to a tea story that said tea is better. Little did I know it was the beginning of something that would last a lifetime.",
		author: "Pavan",
		image: picOne,
		alt: "A memory from when Pavan and Sanjana first started talking",
	},
	{
		date: "14th November 2023",
		title: "1st Date",
		story:
			"Of all the days to pick for our first date, we chose Children's Day. Fate seemed to be having some fun with us, because we ended up on the very same bus without planning it. When we got down at Vidyanagar, we found our way to The Oaks, and that little rush of nerves and giggles became our first date. Afterwards, we went shopping together. Back then, I never imagined that one day we'd be picking out things for our own wedding side by side.",
		author: "Sanjana",
		image: picTwo,
		alt: "A memory from Pavan and Sanjana's first date",
	},
	{
		date: "24th December 2023",
		title: "Dhurandhar in Dharwad, Mission Undercover",
		story:
			"I never thought I'd come all the way to Dharwad and still keep my parents completely unaware that I was there. I had to make the trip down to console Sanjana after our first-ever fight. Apparently, boyfriend duties now include emergency trips to Dharwad. Next time my manager hears that I am sick, I am probably not. ",
		author: "Pavan",
		image: picThree,
		alt: "A memory from Pavan's surprise trip to Dharwad",
	},
	{
		date: "28th December 2023",
		title: "Lights-Camera-Action",
		story:
			"I skipped class, he skipped work, and we had no plans, only a sunny afternoon. We ran out of places to go, so we picked a movie neither of us really wanted to watch. Somewhere between the popcorn and the laughs, that random plan became one of our most special days. Neither of us remembers the name of the movie. Was it Dunki?",
		author: "Sanjana",
		image: picFour,
		alt: "A memory from a sunny movie day together",
	},
	{
		date: "25th April 2024",
		title: "The Cupcake Fairy Was Pavan",
		story:
			"Good day. Night train. Me, cranky and desperate for sleep after adventures at Wonderla. What I didn't know was that Pavan and his parents were on the same train. Just as I drifted off, a mysterious figure appeared with cupcakes, my favorite ones, for my entire gang. Nope, not a cupcake fairy. Just Pavan, who had sprinted to Glen's in the middle of the night to cheer me up.",
		author: "Sanjana",
		image: picFive,
		alt: "A memory of cupcakes shared on a night train",
	},
	{
		date: "1st May 2025",
		title: "Our First Ride: Buckle Up, Pavan",
		story:
			"One random midnight, my phone buzzed with photos of Pavan posing next to a shiny car. I thought, 'Aww, nice car, whose is it?' Plot twist: it was his first car, and I was the last to know. Two months passed before our first ride, and then he took me on our first long ride to Dori Lake. I yapped nonstop the entire way, and he just kept driving and listening. Case dismissed.",
		author: "Sanjana",
		image: videoOne,
		alt: "Video memory from Pavan and Sanjana's first long drive",
		isVideo: true,
	},
	{
		date: "14th February 2026",
		title: "Valentine's Day Together",
		story:
			"Why is it that the guy who says 'I don't celebrate Valentine's Day' always ends up with the girl who goes, 'Yayy, it's Valentine's Day!'? After almost three years of dating, this was our very first Valentine's Day together. We went to a fancy cafe, discovered that the food was a mystery but the bill was not, and ended the day with roadside pani puri, the real star of the date.",
		author: "Sanjana",
		image: picSix,
		alt: "A Valentine's Day memory together",
	},
	{
		date: "21st March 2026",
		title: "When Our Families Said Yes",
		story:
			"Then came the day our families met each other and decided that these two were better married off. It was a simple sentence, a very big yes, and the beginning of the chapter we are so excited to share with everyone we love.",
		author: "Sanjana",
		image: picSeven,
		alt: "A memory from when both families met",
	},
] as const;
