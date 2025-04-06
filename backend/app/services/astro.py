import random
from typing import Dict, List

# Mock astrological responses for each zodiac sign
MOCK_RESPONSES: Dict[str, List[str]] = {
    "general": [
        "The celestial bodies are aligned in your favor today. Trust your intuition and move forward with confidence.",
        "The stars suggest a period of reflection. Take time to consider your path and make adjustments as needed.",
        "The universe is sending you positive energy. Embrace new opportunities that come your way.",
        "The planets indicate a time of transformation. Be open to change and personal growth.",
        "The cosmic energies are supporting your endeavors. This is a good time to pursue your goals."
    ],
    "aries": [
        "As a fiery Aries, your natural leadership is enhanced today. Take initiative on that project you've been considering.",
        "Mars, your ruling planet, is energizing your confidence. Use this boost to overcome obstacles in your path.",
        "Your Aries determination is particularly strong. Channel this energy into productive pursuits rather than impulsive actions.",
        "The ram's courage is yours to harness today. Face challenges head-on and you'll likely succeed.",
        "Your pioneering Aries spirit is highlighted. This is an excellent time to start new ventures or explore new ideas."
    ],
    "taurus": [
        "As a grounded Taurus, your patience will be rewarded today. Stay consistent with your efforts.",
        "Venus, your ruling planet, is enhancing your appreciation for beauty and comfort. Take time to enjoy life's pleasures.",
        "Your Taurus stability is your strength now. Others may rely on your steadfast nature during turbulent times.",
        "The bull's persistence is working in your favor. Continue methodically toward your goals, and you'll see progress.",
        "Your practical Taurus approach is exactly what's needed. Trust your ability to create tangible results."
    ],
    "gemini": [
        "As a versatile Gemini, your communication skills are particularly sharp today. Express your ideas confidently.",
        "Mercury, your ruling planet, is boosting your mental agility. This is an excellent time for learning or teaching.",
        "Your Gemini adaptability is a major asset now. Embrace change and you'll discover new opportunities.",
        "The twins' curiosity is leading you to valuable insights. Follow your interests and expand your knowledge.",
        "Your quick Gemini wit is especially charming today. Social connections will likely be rewarding and stimulating."
    ],
    "cancer": [
        "As an intuitive Cancer, your emotional intelligence is heightened today. Trust your feelings about important matters.",
        "The Moon, your ruling celestial body, is enhancing your nurturing nature. Supportive actions will strengthen relationships.",
        "Your Cancer sensitivity is allowing you to perceive subtle energies. Pay attention to your inner voice and dreams.",
        "The crab's protective instincts are strong now. Creating safe spaces for yourself and loved ones will bring comfort.",
        "Your caring Cancer heart is opening to deeper connections. Allow yourself to be vulnerable with those who deserve your trust."
    ],
    "leo": [
        "As a radiant Leo, your natural charisma is magnified today. Step into the spotlight with confidence.",
        "The Sun, your ruling celestial body, is energizing your creative powers. Express yourself boldly and authentically.",
        "Your Leo generosity will create positive ripple effects. Share your gifts and strengths with others.",
        "The lion's courage is yours to embody now. Face any fears with the royal dignity that is your birthright.",
        "Your warm Leo heart is attracting admirers. Relationships of all kinds are likely to flourish under your sunny influence."
    ],
    "virgo": [
        "As a meticulous Virgo, your analytical skills are particularly sharp today. Your attention to detail will lead to excellence.",
        "Mercury, your ruling planet, is enhancing your practical intelligence. Solutions to complex problems are within reach.",
        "Your Virgo diligence is paying off in tangible ways. Continue refining your methods for even greater efficiency.",
        "The maiden's healing touch is especially potent now. Consider how you might improve wellness for yourself and others.",
        "Your discerning Virgo nature helps you separate what matters from distractions. Focus on quality over quantity."
    ],
    "libra": [
        "As a harmonious Libra, your diplomatic skills are particularly valuable today. You can help bridge understanding between opposing views.",
        "Venus, your ruling planet, is highlighting your appreciation for beauty and balance. Surround yourself with aesthetic pleasures.",
        "Your Libra sense of fairness is guiding you toward equitable solutions. Trust your instinct for justice.",
        "The scales are finding their balance in your relationships. Small adjustments now will prevent larger imbalances later.",
        "Your charming Libra nature opens doors to social connections. Networking efforts are likely to be particularly fruitful."
    ],
    "scorpio": [
        "As a powerful Scorpio, your intensity is focused and effective today. Channel your passion toward meaningful goals.",
        "Pluto, your ruling planet, is deepening your transformative abilities. Embrace necessary endings that make way for new beginnings.",
        "Your Scorpio perception sees beneath surface appearances. Trust your insights about hidden motivations and agendas.",
        "The scorpion's protective nature is activated. Establish healthy boundaries while maintaining meaningful connections.",
        "Your resourceful Scorpio nature finds value where others see only obstacles. Your ability to regenerate and transform is your greatest asset."
    ],
    "sagittarius": [
        "As an adventurous Sagittarius, your optimism is especially inspiring today. Share your vision and elevate those around you.",
        "Jupiter, your ruling planet, is expanding your horizons. New learning opportunities are appearing - follow your curiosity.",
        "Your Sagittarius honesty is refreshing to those tired of pretense. Speak your truth with kindness and conviction.",
        "The archer's aim is true now. Focus on your most important targets rather than scattering your energies.",
        "Your philosophical Sagittarius nature is contemplating life's big questions. Make time for both adventure and reflection."
    ],
    "capricorn": [
        "As an ambitious Capricorn, your discipline is your superpower today. Consistent efforts will yield impressive results.",
        "Saturn, your ruling planet, is strengthening your foundation. Build methodically for lasting success.",
        "Your Capricorn practicality cuts through illusions and fantasies. Your realistic approach will save time and resources.",
        "The goat's steady climb continues to move you toward your summit. Each step matters, so maintain your patience.",
        "Your responsible Capricorn nature earns respect from important connections. Your reliability is not going unnoticed."
    ],
    "aquarius": [
        "As an innovative Aquarius, your unique perspective offers solutions others cannot see. Trust your unconventional thinking.",
        "Uranus, your ruling planet, is sparking brilliant insights. Expect sudden clarity about matters that have confused you.",
        "Your Aquarius humanitarian spirit is activated. Consider how your actions can benefit the collective good.",
        "The water-bearer's independent nature requires freedom to explore. Create space for experiments and new ideas.",
        "Your progressive Aquarius vision is particularly clear now. Don't hesitate to share ideas that seem ahead of their time."
    ],
    "pisces": [
        "As an intuitive Pisces, your compassion creates healing spaces. Your sensitivity is a gift, not a limitation.",
        "Neptune, your ruling planet, is enhancing your creative imagination. Artistic pursuits will be especially rewarding.",
        "Your Pisces connection to spiritual dimensions offers guidance beyond rational thinking. Pay attention to synchronicities.",
        "The fishes' adaptability helps you flow around obstacles rather than struggling against them. Flexibility is your strength now.",
        "Your empathic Pisces nature absorbs environmental energies. Remember to cleanse your aura and set healthy boundaries."
    ],
    "love": [
        "The stars suggest romance is in the air. Be open to unexpected connections and magical moments.",
        "Venus is highlighting harmony in relationships. Express your feelings honestly and listen with an open heart.",
        "The cosmos indicates a time for healing in relationships. Forgiveness and understanding will strengthen bonds.",
        "Celestial alignments favor deepening intimacy. Share your authentic self with those you trust.",
        "The planets support relationship growth. Small gestures of love will have meaningful impact now."
    ],
    "career": [
        "The stars indicate professional advancement. Your efforts are being noticed by those in positions of influence.",
        "Mercury supports clear communication at work. Express your ideas confidently in meetings and presentations.",
        "Saturn rewards diligence and structure. Organizing your workflow will increase productivity and recognition.",
        "Jupiter expands career opportunities. Be ready to say yes to projects that stretch your abilities.",
        "Mars energizes your professional ambition. This is an excellent time to take initiative on important projects."
    ],
    "health": [
        "The celestial bodies emphasize balance for wellbeing. Consider how to harmonize work, rest, and play in your routine.",
        "The moon influences your emotional health. Nurturing activities like meditation or nature walks will restore inner peace.",
        "Jupiter supports vitality and resilience. Physical activities that bring joy will be particularly beneficial now.",
        "Neptune heightens intuition about wellness needs. Pay attention to what your body is communicating to you.",
        "Venus encourages self-care rituals. Taking time for beauty and pleasure is not indulgence but necessary nourishment."
    ]
}

def get_astro_response(query: str, user_name: str = "") -> str:
    """Generate a mock astrological response based on user query"""
    
    # Check if query mentions specific zodiac sign
    query_lower = query.lower()
    for sign in ["aries", "taurus", "gemini", "cancer", "leo", "virgo", 
                "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]:
        if sign in query_lower:
            return random.choice(MOCK_RESPONSES[sign])
    
    # Check for specific topics
    if any(word in query_lower for word in ["love", "relationship", "partner", "romance", "dating"]):
        return random.choice(MOCK_RESPONSES["love"])
    
    if any(word in query_lower for word in ["job", "career", "work", "profession", "business"]):
        return random.choice(MOCK_RESPONSES["career"])
    
    if any(word in query_lower for word in ["health", "wellness", "fitness", "body", "energy"]):
        return random.choice(MOCK_RESPONSES["health"])
    
    # Default to general response
    response = random.choice(MOCK_RESPONSES["general"])
    
    # Personalize if user name is provided
    if user_name:
        personalized_intros = [
            f"{user_name}, {response}",
            f"Dear {user_name}, {response}",
            f"For you {user_name}: {response}",
            f"{response} This is especially true for you, {user_name}.",
            f"{response} Remember this, {user_name}, as you navigate your path."
        ]
        return random.choice(personalized_intros)
    
    return response