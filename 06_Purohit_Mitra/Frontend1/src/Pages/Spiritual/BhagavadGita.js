// src/Pages/Spiritual/Bg.js
import React, { useState } from "react";
import "./SpiritualPage.css";
import mandala from "../../Assets/mandalaright-removebg-preview.png";

const chapters = [
  {
    title: "Chapter 1: Arjuna Vishada Yoga",
    content: `
     Arjuna, the mighty warrior of the Pandavas, stands on the battlefield of Kurukshetra. He sees his relatives, friends, and teachers on the opposite side, ready for war. Overcome with sorrow and moral confusion, he questions the righteousness of the battle. How can he fight and kill his own kin? Arjuna’s heart is heavy, and he is torn between duty as a warrior and love for his family. He puts down his bow, unable to lift it, and confesses his fears and despair to Krishna. He laments the destruction that war will bring and worries about the consequences for families, society, and dharma. Arjuna’s hesitation shows the struggle between personal emotions and societal duties. He seeks guidance on what is right and what is wrong. Krishna, his charioteer and divine guide, listens patiently, ready to provide clarity.
      <br><br><strong>Key Lesson:</strong> Seek clarity and guidance in moments of confusion and moral dilemmas.`
  },
  {
    title: "Chapter 2: Sankhya Yoga",
    content: `
      Seeing Arjuna despondent, Krishna begins teaching him about the eternal nature of the soul. The body is temporary and perishable, but the soul is immortal and indestructible. Krishna explains that sorrow arises from attachment to the material body and worldly relations. He emphasizes performing one’s duty according to dharma without attachment to the results. Knowledge (Sankhya) and wisdom allow a person to rise above sorrow and act with equanimity. Krishna teaches the importance of selfless action and discipline in life. Arjuna begins to understand that fear and sorrow arise from ignorance. By knowing the eternal self and focusing on righteous action, one can overcome despair and confusion. Krishna also introduces the concept of Karma Yoga, the path of action without attachment. Arjuna listens and starts understanding that his duty as a warrior is not just physical fighting but spiritual responsibility.
      <br/><br/>
      <strong>Key Lesson:</strong> Understand the eternal soul and act without attachment to the fruits of action.`
  },
  {
    title: "Chapter 3: Karma Yoga",
    content: `
  Krishna explains that life requires action, and performing one’s duty selflessly is essential. Avoiding action is not the path to liberation, nor is acting with selfish desire. Karma Yoga teaches that every action should be done as an offering to God, without expecting personal gain. By performing duties without attachment, the mind remains calm and free from bondage. Krishna emphasizes that even the smallest actions, when done with the right intention, become a path to spiritual growth. He illustrates how inaction can cause disorder in society, and selfless action maintains harmony. Arjuna learns that controlling desires and focusing on duty brings inner peace. The teachings of Karma Yoga highlight that work itself is a form of devotion and worship when done with mindfulness and detachment. By balancing action with discipline and surrender, one attains freedom from material bondage.
      <br/><br/>
      <strong>Key Lesson:</strong> Perform your responsibilities selflessly to attain spiritual growth.`
  },
  {
    title: "Chapter 4: Jnana Karma Sanyasa Yoga",
    content: `
      Krishna explains the importance of knowledge (Jnana) in guiding action. Sacrifices and duties performed with understanding lead to liberation, while actions without knowledge create bondage. He reveals that wisdom, combined with selfless action, purifies the soul. Arjuna learns about the distinction between worldly action and spiritual action. Krishna emphasizes that true renunciation is not abandoning duties but renouncing attachment to results. Actions performed with devotion, clarity, and wisdom are superior. This chapter shows how knowledge, discipline, and selfless action work together for spiritual advancement. Arjuna begins to understand the deeper purpose of life, the importance of learning, and the path of action guided by wisdom.
      <br/><br/>
      <strong>Key Lesson:</strong> Knowledge plus action leads to spiritual advancement.`
  },
  {
    title: "Chapter 5: Karma Sanyasa Yoga",
    content: `
   Krishna explains that both renunciation and selfless action lead to liberation. True renunciation is letting go of attachment, not abandoning duties. Performing one’s work with detachment purifies the mind and leads to freedom. Action and renunciation are complementary; one can act while remaining unattached. Arjuna learns that avoiding duty is not renunciation, and performing duties with selfish motives binds the soul. By surrendering outcomes and focusing on righteousness, a person achieves peace. Krishna highlights that discipline, wisdom, and devotion are essential for liberation. The chapter emphasizes balance between action and renunciation, teaching that one should perform duties while remaining spiritually unattached.
      <br/><br/>
      <strong>Key Lesson:</strong> Balance duty with detachment to achieve inner freedom.`
  },
  {
    title: "Chapter 6: Dhyana Yoga",
    content: `
      Krishna teaches the path of meditation (Dhyana) and self-discipline. Controlling the mind and senses brings peace and clarity. A yogi practices detachment, self-control, and focuses on inner development. Arjuna learns that a disciplined mind allows one to see the self in all beings and all beings in the self. Meditation develops inner calm, equanimity, and understanding of the soul. Krishna emphasizes moderation in eating, sleeping, working, and recreation. Through meditation, one attains spiritual growth and detachment from material desires. The chapter teaches the importance of focus, self-control, and connecting with the eternal self.
      <br/><br/>
      <strong>Key Lesson:</strong> Mind control and meditation bring mental clarity and spiritual peace.`
  },
  {
    title: "Chapter 7: Jnana Vijnana Yoga",
    content: `
Krishna explains the nature of the ultimate reality (Brahman) and how divine knowledge leads to understanding the world and the self. He teaches the difference between material and spiritual knowledge. Arjuna learns that devotion, wisdom, and understanding God’s presence in all beings are essential for liberation. Krishna reveals the science of divine knowledge and encourages seeking spiritual insight. This chapter emphasizes faith, knowledge, and devotion as intertwined paths. By cultivating wisdom and surrendering to God, one attains spiritual growth and clarity.
      <br/><br/>
      <strong>Key Lesson:</strong> True knowledge and devotion lead to realization of the supreme.`
  },
  {
    title: "Chapter 8: Aksara Brahma Yoga",
    content: `
     Krishna explains life after death and the immortal soul. The body is temporary, but the soul never dies. He teaches that remembering God at the time of death leads to liberation. Arjuna learns the importance of focusing the mind on God throughout life. Actions and devotion shape the soul’s journey after death. Krishna elaborates on the nature of karma, rebirth, and ultimate liberation. By understanding the eternal and imperishable, one rises above fear of death and develops faith in God. The chapter emphasizes constant remembrance of the divine for spiritual security.
      <br/><br/>
      <strong>Key Lesson:</strong> Constant remembrance of God ensures spiritual liberation.`
  },
  {
    title: "Chapter 9: Raja Vidya Raja Guhya Yoga",
    content: `
     Krishna teaches the supreme knowledge (Raja Vidya) and supreme secret (Raja Guhya). Devotion, faith, and surrender to God are the highest paths to liberation. Arjuna learns that the divine pervades all beings and the universe. Rituals and actions are secondary to true devotion. Even the simplest act done with faith and love for God is superior. Krishna highlights that God loves sincere devotees and responds to their prayers. This chapter emphasizes the power of devotion, faith, and wisdom combined.

      <br/><br/>
      <strong>Key Lesson:</strong> Devotion and surrender to God are supreme.`
  },
  {
    title: "Chapter 10: Vibhuti Yoga",
    content: `
    Krishna reveals His divine manifestations in the universe. Everything magnificent, powerful, and extraordinary originates from Him. Arjuna learns to recognize the divine in creation, leaders, wisdom, and natural phenomena. God’s glory pervades everything, and understanding this inspires devotion and reverence. Krishna shows that seeing the divine in all beings strengthens faith and humility. Recognition of God’s manifestations fosters spiritual awareness and detachment from ego.

      <br/><br/>
      <strong>Key Lesson:</strong> Recognize God in all greatness around us.`
  },
  {
    title: "Chapter 11: Visvarupa Darshana Yoga",
    content: `
    Krishna grants Arjuna divine vision to see His cosmic, universal form. Arjuna witnesses countless faces, arms, and divine manifestations encompassing creation and destruction. The universal form shows Krishna as the source and destroyer of all beings. Arjuna is awestruck and realizes the omnipotence of God. He sees the cycle of life, death, and the fate of warriors in the war. Krishna explains that all events unfold according to divine will. Arjuna’s fear turns to humility and devotion as he acknowledges God’s infinite power.

      <br/><br/>
      <strong>Key Lesson:</strong> God is beyond human comprehension and pervades the universe.`
  },
  {
    title: "Chapter 12: Bhakti Yoga",
    content: `Krishna teaches the power of devotion (Bhakti). A loving, surrendered heart attains God effortlessly. Devotion surpasses rituals, austerities, and ceremonies. Arjuna learns that constant remembrance, love, and selfless service to God purify the heart. Even simple devotion is more powerful than complicated practices. The chapter emphasizes cultivating a devoted mind, humility, compassion, and trust in God. A devoted soul remains steadfast and attains peace, freedom, and divine grace.

      <br/><br/>
      <strong>Key Lesson:</strong> Devotion purifies the heart and connects one to the divine.`
  },
  {
    title: "Chapter 13: Kshetra Kshetragna Yoga",
    content: `
     Krishna explains the difference between the body (kshetra) and the soul (kshetragna). The body is temporary; the soul is eternal. Understanding the distinction leads to spiritual growth and self-realization. Knowledge of the self allows one to rise above material attachments. Arjuna learns that the divine pervades all beings and the field of activity. By understanding the soul and the material body, one gains clarity, detachment, and spiritual insight.
.
      <br/><br/>
      <strong>Key Lesson:</strong> Understand the difference between body and soul for self-realization.`
  },
  {
    title: "Chapter 14: Gunatraya Vibhaga Yoga",
    content: `Krishna explains the three modes (gunas) of material nature: Sattva (goodness), Rajas (passion), and Tamas (ignorance). Sattva leads to clarity and wisdom, Rajas to desire and restlessness, Tamas to darkness and ignorance. These modes influence human behavior, thought, and spiritual progress. Krishna teaches Arjuna to transcend these modes to attain liberation. By cultivating sattva and rising above passion and ignorance, one achieves peace, clarity, and spiritual advancement.

      <br/><br/>
      <strong>Key Lesson:</strong> Rise above the modes of material nature to attain liberation.`
  },
  {
    title: "Chapter 15: Purushottama Yoga",
    content: `
  Krishna teaches about the eternal soul and the supreme divine person (Purushottama). The material world is temporary and perishable, while the divine is eternal. Arjuna learns that detachment from material illusions and devotion to God leads to liberation. Understanding the supreme reality helps one rise above worldly suffering and fear. The chapter emphasizes devotion, knowledge, and detachment as paths to realize the eternal divine.

      <br/><br/>
      <strong>Key Lesson:</strong> Recognize the eternal divine beyond material existence.`
  },
  {
    title: "Chapter 16: Daivasura Sampad Vibhaga Yoga",
    content: `
     Krishna explains the divine (daivi) and demoniac (asuri) qualities present in humans. Divine qualities include fearlessness, compassion, humility, and self-control, leading to liberation. Demoniac qualities include arrogance, cruelty, and selfishness, leading to bondage. Arjuna learns that cultivating divine virtues strengthens the soul, purifies the mind, and elevates consciousness. Avoiding demoniac traits ensures spiritual progress.

      <br/><br/>
      <strong>Key Lesson:</strong> Develop divine qualities in thought, word, and deed.`
  },
  {
    title: "Chapter 17: Sraddhatraya Vibhaga Yoga",
    content: `Krishna explains that faith differs according to the modes of nature: sattvic, rajasic, and tamasic. Sattvic faith is based on knowledge and devotion, leading to enlightenment. Rajasic faith is attached to desires, and tamasic faith is rooted in ignorance. Arjuna learns how faith influences worship, behavior, and spiritual progress. Cultivating sattvic faith strengthens devotion, understanding, and spiritual growth.

      <br/><br/>
      <strong>Key Lesson:</strong> Cultivate sattvic faith for spiritual progress.`
  },
  {
    title: "Chapter 18: Moksha Sanyasa Yoga",
    content: `
    Krishna summarizes all teachings: renunciation, duty, devotion, and surrender. Acting according to dharma with detachment, wisdom, and devotion leads to liberation. Arjuna learns that surrender to God, selfless action, and detachment from results bring ultimate freedom. Krishna emphasizes performing one’s duties, understanding the eternal soul, and transcending material attachments. Arjuna gains clarity and courage to act in alignment with divine will.
      <br/><br/>
      <strong>Key Lesson:</strong> Surrender to God, perform righteous action, and attain ultimate liberation.`
  }
];

const Bg = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (openIndex === index) setOpenIndex(null);
    else setOpenIndex(index);
  };

  return (
    <div className="spiritual-container">
      {/* Mandalas */}
      <img src={mandala} alt="mandala" className="home-mandala-left" />
      <img src={mandala} alt="mandala" className="home-mandala" />

      {/* Page title */}
      <h1 className="spiritual-title">Bhagavad Gita</h1>

      {/* Chapters Accordion */}
      <div className="accordion-wrapper">
        {chapters.map((chapter, index) => (
          <div key={index} className="accordion-item">
            <div
              className="accordion-title"
              onClick={() => toggleAccordion(index)}
            >
              <h2>{chapter.title}</h2>
              <span>{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && (
              <div
                className="accordion-content"
                dangerouslySetInnerHTML={{ __html: chapter.content }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bg;
