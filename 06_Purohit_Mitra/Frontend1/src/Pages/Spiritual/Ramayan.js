// src/Pages/Spiritual/Ramayan.js
import React, { useState } from "react";
import "./SpiritualPage.css";
import mandala from "../../Assets/mandalaright-removebg-preview.png";

const kands = [
  {
    title: "Bala Kand (Childhood of Rama)",
    content: `
 Bala Kand narrates the birth and early life of Lord Rama, the eldest son of King Dasharatha of Ayodhya. Rama was born to Queen Kausalya as the embodiment of dharma and virtue. From a young age, he displayed extraordinary intelligence, strength, and devotion to his parents and elders. Alongside his brothers Lakshmana, Bharata, and Shatrughna, Rama grew under the guidance of Sage Vashishta, who trained them in archery, statecraft, ethics, and spirituality. The young princes learned discipline, meditation, and adherence to dharma. The chapter also describes the swayamvar of Sita, daughter of King Janaka of Mithila. Suitors from across kingdoms came to lift the divine bow of Lord Shiva to win her hand, but none succeeded. Rama, with his unmatched strength and divine blessings, effortlessly broke the bow and married Sita. The chapter teaches that a life rooted in righteousness, discipline, and devotion builds moral character and strength of purpose. Bala Kand also introduces key ideals such as obedience to elders, respect for teachers, humility, and the significance of learning from a young age. These lessons set the foundation for Rama’s future as an ideal king and dharmic hero.
      
 <br/><br/>
      <strong>Key Lesson:</strong> Virtue, devotion, and righteousness shape a noble life.
    `
  },
  {
    title: "Ayodhya Kand (Rama’s Exile)",
    content: `
      Ayodhya Kand focuses on the events leading to Rama’s exile and the challenges faced by the royal family. King Dasharatha, due to a promise made to his wife Kaikeyi years earlier, is forced to send Rama into exile for fourteen years. Rama, despite being the rightful heir to the throne, accepts this command without hesitation, exemplifying obedience and commitment to dharma. Sita and Lakshmana voluntarily accompany him into the forest, leaving behind the comforts of palace life. Bharata, who loves Rama dearly, returns to Ayodhya and refuses to take the throne, instead placing Rama’s sandals on the throne as a symbol of rightful rule. During the exile, Rama faces the harsh realities of forest life, encountering sages, ascetics, and local communities. He learns the balance between worldly responsibilities and spiritual growth, understanding the impermanence of material life. The chapter also reflects the emotional turmoil of separation, duty over personal desire, and the importance of maintaining integrity even under pressure. Rama’s calm acceptance and unwavering adherence to dharma inspire everyone who witnesses his actions. The story illustrates the value of sacrifice, selflessness, and the courage to face difficult circumstances with grace. Ayodhya Kand teaches that duty, honor, and moral righteousness must guide actions, even in the face of personal loss or hardship.
      <br/><br/>
      <strong>Key Lesson:</strong> Duty and obedience to dharma should be followed even in hardship.
    `
  },
  {
    title: "Aranya Kand (Life in the Forest)",
    content: `
     Aranya Kand describes the life of Rama, Sita, and Lakshmana during their forest exile. Living amidst dense forests and wild creatures, they embrace simplicity and spiritual practice while staying vigilant against evil forces. They encounter demons like Tataka, whom Rama defeats with precision and righteousness, and Maricha, who uses deceit to disturb their peace. The narrative also includes Surpanakha, Ravana’s sister, who attempts to seduce Rama and Lakshmana. When her advances are rejected, she attacks Sita, leading Lakshmana to mutilate her nose, escalating enmity with Ravana. In retaliation, Ravana abducts Sita and carries her to Lanka, setting the stage for the epic battle. This Kand introduces Hanuman and other vanaras, who later play crucial roles in locating Sita and supporting Rama’s mission. The chapter emphasizes courage, vigilance, and the need for strategic thinking when facing adversaries. It also teaches the dangers of lust, greed, and arrogance through Ravana’s actions. Rama’s compassion, wisdom, and adherence to dharma contrast sharply with the evils of Ravana, highlighting the eternal struggle between righteousness and immorality. Aranya Kand is rich in moral lessons about the consequences of actions, importance of courage, and staying true to virtue under challenging circumstances. The chapter also underscores the value of friendship, loyalty, and assistance from devoted allies in difficult times.

      <br/><br/>
      <strong>Key Lesson:</strong> Courage, wisdom, and loyalty are essential virtues in adversity.
    `
  },
  {
    title: "Kishkindha Kand (Alliance with Hanuman and Sugriva)",
    content: `
Kishkindha Kand narrates Rama’s encounter with Sugriva, the exiled monkey king, and his loyal servant Hanuman. Rama learns of Sugriva’s plight and agrees to help him reclaim his kingdom from his brother Vali. This alliance becomes a turning point in Rama’s search for Sita. Hanuman is portrayed as exceptionally intelligent, brave, and devoted, willing to risk his life to serve Rama. With strategic planning and courage, Sugriva regains his throne, and in return, pledges to assist Rama in finding Sita. The chapter also explores themes of friendship, loyalty, trust, and mutual respect. Rama’s wisdom in handling the situation teaches diplomacy and fairness. Through discussions, battles, and planning, the narrative shows that successful action often requires collaboration, courage, and unwavering devotion to righteousness. Kishkindha Kand illustrates that even small allies, when devoted and capable, can achieve great deeds. It also emphasizes strategic thinking, careful judgment, and ethical conduct in alliances. By forming the right partnerships, challenges that seem insurmountable can be overcome with unity and faith.

      <br/><br/>
      <strong>Key Lesson:</strong> Friendship, loyalty, and strategy are key to overcoming challenges.
    `
  },
  {
    title: "Sundar Kand (Hanuman’s Journey to Lanka)",
    content: `
    Sundar Kand focuses on Hanuman’s heroic journey to Lanka to locate Sita. Hanuman leaps across the ocean, overcomes numerous obstacles, defeats demons, and finally reaches Ashoka Vatika, where Sita is held captive. He reassures her, conveying Rama’s message of hope and love. Hanuman assesses Ravana’s army and causes havoc in Lanka by setting fire to palaces and destroying enemy forces. His courage, devotion, intelligence, and unwavering faith in Rama are central to this chapter. The narrative emphasizes the virtues of perseverance, selfless service, and fearlessness. Hanuman’s journey showcases that devotion can overcome even the most impossible obstacles. The chapter also teaches the importance of patience, observation, and strategy while undertaking significant tasks. Through Hanuman’s actions, readers learn that true devotion manifests in both courage and wisdom. Sundar Kand inspires faith, determination, and moral integrity, showing that with complete trust in God and ethical conduct, victory over evil is assured.

      <br/><br/>
      <strong>Key Lesson:</strong> Devotion, courage, and perseverance lead to success against adversity.
    `
  },
  {
    title: "Lanka Kand / Yuddha Kand (Battle in Lanka)",
    content: `
Lanka Kand narrates the great war between Rama’s forces and Ravana’s army. The battle is fierce, with many heroic feats, including the bravery of Lakshmana, Hanuman, and other vanaras. Rama confronts Ravana in a climactic duel and ultimately defeats him, rescuing Sita. The narrative emphasizes the triumph of good over evil, moral righteousness, and devotion. Loyalty, strategic planning, and selfless action are highlighted throughout the battle. The story also illustrates the consequences of arrogance, ego, and unethical behavior through Ravana’s downfall. Rama’s victory signifies that dharma, courage, and righteousness prevail against injustice and cruelty. The chapter teaches that one’s devotion, courage, and unwavering adherence to moral principles guide actions in times of conflict. Through detailed descriptions of strategy, valor, and moral decisions, Lanka Kand provides lessons about leadership, justice, and ethical conduct.

      <br/><br/>
      <strong>Key Lesson:</strong> Goodness, courage, and righteousness always triumph over evil.
    `
  },
  {
    title: "Uttara Kand (Aftermath and Lessons)",
    content: `
   Uttara Kand describes Rama’s return to Ayodhya, his coronation, and the restoration of dharma. Sita undergoes a trial by fire to prove her purity, demonstrating her steadfast virtue and devotion. The chapter also deals with Rama’s rule, emphasizing justice, fairness, and ethical governance. It includes the moral and social lessons of responsibility, ideal conduct, and adherence to dharma. Rama’s life exemplifies the ideal king, son, husband, and human being. Uttara Kand reflects on the importance of moral choices, devotion, loyalty, and the consequences of actions. The chapter highlights that ethical living, even in times of triumph and prosperity, ensures a stable, prosperous, and righteous society. Lessons from Uttara Kand are timeless: uphold dharma, treat all beings with respect, and govern with wisdom and fairness. The narrative also inspires devotion, selflessness, and the pursuit of virtue in everyday life.
    
      <br/><br/>
      <strong>Key Lesson:</strong> Righteousness, justice, and devotion guide a fulfilled life.
    `
  }
];

const Ramayan = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="spiritual-container">
      {/* Mandalas */}
      <img src={mandala} alt="mandala" className="home-mandala-left" />
      <img src={mandala} alt="mandala" className="home-mandala" />

      {/* Page title */}
      <h1 className="spiritual-title">Ramayan</h1>

      {/* Accordion for Kands */}
      <div className="accordion-wrapper">
        {kands.map((kand, index) => (
          <div key={index} className="accordion-item">
            <div
              className="accordion-title"
              onClick={() => toggleAccordion(index)}
            >
              <h2>{kand.title}</h2>
              <span>{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && (
              <div
                className="accordion-content"
                dangerouslySetInnerHTML={{ __html: kand.content }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ramayan;

