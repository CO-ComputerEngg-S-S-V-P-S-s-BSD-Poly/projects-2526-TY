import React, { useState } from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";


const Prayers = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const aartiList = [
    {
      title: "Ganesh Aarti",
      deity: "Lord Ganesha",
      full: `Sukhkarta Dukhharta Varta Vighnachi ||
Nurvi Purvi Prem Krupa Jayachi ||
Sarvangi Sundar Uti Shendurachi ||
Kanti Jhalke Mal Mukataphalaanchi..||
Jaidev Jaidev Jai Mangal Murti ||
Darshan Maatre Man: Kaamna Phurti ||
Ratnakhachit Phara Tujh Gaurikumra ||
Chandanaachi Uti Kumkumkeshara ||
Hirejadit Mukut Shobhato Bara ||
Runjhunati Nupure(2) Charani Ghagriya ||
Jaidev Jaidev Jai Mangal Murti ||
Lambodar Pitaambar Phanivarvandana ||
Saral Sond Vakratunda Trinayana ||
Das Ramacha Vat Pahe Sadana ||
Sankati Pavave Nirvani Rakshave Survarvandana ||
Jaidev Jaidev Jai Mangal Murti ||`
    },

    {
      title: "Lakshmi Aarti",
      deity: "Goddess Lakshmi",
      full: `Om Jai Lakshmi Mata, Maiya Jai Lakshmi Mata,
Tumko Nishdin Sevat, Tumko Nishdin Sevat,
Har Vishnu Vidhata.
Om Jai Lakshmi Mata
Om Jai Lakshmi Mata, Maiya Jai Lakshmi Mata,
Tumko Nishdin Sevat, Tumko Nishdin Sevat,
Har Vishnu Vidhata.
Om Jai Lakshmi Mata
Uma Rama Bharmani, Tum Hi Jag Mata,
maiyya tum hi jag mata
Surya Chandrma Dhyavat, Surya Chandrma Dhyavat
Naarad Rishee Gata.
Om Jai Lakshmi Mata
Durga Roop Niranjani, Sukh Sampati Data,
maiyya sukh sampati data
Jo Koi Tum Ko Dhayata, Jo Koi Tum Ko Dhayata
Riddhi Siddhi Pata.
Om Jai Lakshmi Mata
Tum Patal Nivasini, Tum Hi Shubh Data,
maiyya tum hi subh data
Karam-Prabhav-Prakashini, Karam-Prabhav-Prakashini
Bhav Nidhi Ki Trata.
Om Jai Lakshmi Mata
Jis Ghar Mein Tum Rahti, Sab Sadgun Aata,
maiyya sab sadgun aata
Sab Sambhav Ho Jata, Sab Sambhav Ho Jata
Man Nahi Ghabrata.
Om Jai Lakshmi Mata
Tum Bin Yagya Na Hove, Vastra No ho Pata,
maiyya vastra na ho pata
Khan-Pana Ka Vaibhav, Khan-Pana Ka Vaibhav
Sub Tumse aata.
Om Jai Lakshmi Mata
Shubhgun Mandir Sundar, Sheerodadhi Jata,
maiyya Sheerodadhi Jata,
Ratan Chaturdhsh Tum Bin, Ratan Chaturdhsh Tum Bin
Koi Nahi Pata
Om Jai Lakshmi Mata
Shri lakshmi Ji Ki Aarti, Jo Koi Nar Gata,
maiyya Jo Koi Nar Gata
Urr Anand Samata, Urr Anand Samata
Pap Utar Jata.
Om Jai Lakshmi Mata
Om Jai Lakshmi Mata, Maiya Jai Lakshmi Mata,
Tumko Nishdin Sevat, Tumko Nishdin Sevat,
Har Vishnu Vidhata.
Om Jai Lakshmi Mata`
    },

    {
      title: "Shiv Aarti",
      deity: "Lord Shiva",
      full: `Jai Shiv Omkaara, Om Jai Shiva Omkara,
Bramha, Vishnu, Sadashiv, Ardhangi Dhaara.
Om Jai Shiv Omkara
Ekaanan Chaturaanan Panchaanan Raje,
Hansaanan Garudaasan Vrishvaahan Saaje.
Om Jai Shiv Omkara
Do Bhuj Chaar Chaturbhuj Dasamukh Ati Sohe,
Trigun Rup Nirakhate Tribhuvan Jan Mohe.
Om Jai Shiv Omkara
Akshamaala Vanamaala Mundamaala Dhaari,
Tripuraari Kansaari Kar Maala Dhaari.
Om Jai Shiv Omkara
Shvetambar Pitambar Baaghambar Ange,
Sanakaadik Garunaadik Bhutaadik Sange.
Om Jai Shiv Omkara
Kar Ke Madhy Kamandalu Charka Trishuladhaari,
Sukhakaari Dukhahaari Jagapaalan Kaari.
Om Jai Shiv Omkara
Bramha Vishnu Sadaashiv Jaanat Aviveka,
Pranavaakshar Mein Shobhit Ye Tino Ekaa.
Om Jai Shiv Omkara
Lakshmi Va Saavitri Paarvati Sangaa,
Paarvati Ardhaangi, Shivalahari Gangaa.
Om Jai Shiv Omkaara
Parvat Sohe Parvati, Shankar Kailasa,
Bhang Dhatur Ka Bhojan, Bhasmi Mein Vaasa.
Om Jai Shiv Omkaara
Jataa Me Gang Bahat Hai, Gal Mundan Maala,
Shesh Naag Lipataavat, Odhat Mrugachaala.
Om Jai Shiv Omkaara
Kashi Me Viraaje Vishvanaath, Nandi Bramhchaari,
Nit Uthh Darshan Paavat, Mahimaa Ati Bhaari.
Om Jai Shiv Omkaara
Trigunasvamiji Ki Aarti Jo Koi Nar Gave,
Kahat Shivanand Svami Sukh Sampati Pave.
Om Jai Shiv Omkaara`
    },

    {
      title: "Hanuman Aarti",
      deity: "Lord Hanuman",
      full: `Aarti Kije Hanuman Lala Ki Dusht Dalan Raghunath Kala Ki
Ja Ke Bal Se Giriver Kaanpe, Rog Dosh Ja Ke Nikat Na Jaanke.
Anjani Putra Mahabaldaye, Santan Ke Prabhu Sada Sahaye.
De Beeraha Raghunath Pathai, Lanka Jaari Siya Sudhi Laiye.
Lanka So Kot Samundra Se Khaiy, Jaat Pavan Sut Baar Na
Laiye.
Lanka Jaari Asur Sab Maare, Siya Ramji Ke Kaaj Sanvare.
Lakshman Moorchit Parhe Sakare, Aan Sajeevan Pran Ubhaare.
Paith Pataal Tori Yamkare, Ahiravan Ke Bhuja Ukhaare.
Baayen Bhuja Asur Dal Mare, Daayen Bhuja Sab Santa Jana
Tare.
Surnar Munijan Aarti Utare, Jai Jai Jai Hanuman Uchaare.
Kanchan Thaar Kapoor Lo Chhai, Aarti Karat Aajani Mai.
Jo Hanumanji Ki Aarti Gaave, Basi Baikuntha Amar Padh Pave.
Lanka Vidvance Kiye Ragurai, Tulsidas Swami Aarti Gaaie.
Aarti Ki Jai Hanuman Lala Ki, Dushat Dalan Ragunath Kala Ki.
Pawan Tanay Sankat Haran Managal Moorti Roop,
Ram Lakhan Sita Sahit Hridaya Bhasu Sur Bhoop`

    },

    {
  title: "Durga Aarti",
  deity: "Goddess Durga",
  full: `Jai Ambe Gauri, Maiya Jai Shyama Gauri.
Tumako Nishadin Dhyavat, Hari Bramha Shivari.
Om Jai Ambe Gauri
Mang Sindur Virajat, Tiko Mrigamad Ko.
Ujjval Se Dou Naina, Chandravadan Niko.
Om Jai Ambe Gauri
Kanak Saman Kalevar, Raktambar Raje,
Raktpushp Gal Mala, Kanthan Par Saje.
Om Jai Ambe Gauri
Kehari Vahan Rajat, Khadag Khappar Dhari,
Sur-Nar-Munijan Sevat, Tinake Dukhahari.
Om Jai Ambe Gauri
Kaanan Kundal Shobhit, Nasagre Moti,
Kotik Chandr Divakar, Rajat Sam Jyoti.
Om Jai Ambe Gauri
Shumbh-Nishumbh Bidare, Mahishasur Ghati,
Dhumr Vilochan Naina, Nishadin Madamati.
Om Jai Ambe Gauri
Chand-Mund Sanhare, Shonit Bij Hare,
Madhu-Kaitabh Dou Mare, Sur Bhayahin Kare.
Om Jai Ambe Gauri
Bramhani, Rudrani,Tum Kamala Rani,
Agam Nigam Bakhani,Tum Shiv Patarani.
Om Jai Ambe Gauri
Chausath Yogini Mangal Gavat,Nritya Karat Bhairu,
Bajat Tal Mridanga,Aru Baajat Damaru.
Om Jai Ambe Gauri
Tum Hi Jag Ki Mata, Tum Hi Ho Bharata,
Bhaktan Ki Dukh Harta, Sukh Sampati Karta.
Om Jai Ambe Gauri
Bhuja Char Ati Shobhi,Varamudra Dhari,
Manvanchhit Fal Pavat,Sevat Nar Nari.
Om Jai Ambe Gauri
Kanchan Thal Virajat, Agar Kapur Bati,
Shrimalaketu Mein Rajat, Koti Ratan Jyoti .
Om Jai Ambe Gauri
Shri Ambeji Ki Arati, Jo Koi Nar Gave,
Kahat Shivanand Svami, Sukh-Sampatti Pave.
Om Jai Ambe Gauri`
},

{
  title: "Saraswati Aarti",
  deity: "Goddess Saraswati",
  full: `Jai Saraswati MataMaiya Jai Saraswati Mata
Sadaguna Vaibhava ShaliniTribhuvana Vikhyata
Jai Saraswati Mata
Chandravadani PadmasiniDyuti Mangalakari
Sohe Shubha Hansa SawariAtula Tejadhari
Jai Saraswati Mata
Bayen Kara Mein VeenaDayen Kara Mala
Shisha Mukuta Mani SoheGala Motiyana Mala
Jai Saraswati Mata
Devi Sharana Jo AyeUnaka Uddhara Kiya
Paithi Manthara DasiRavana Samhara Kiya
Jai Saraswati Mata
Vidya Gyana PradayiniGyana Prakasha Bharo
Moha Agyana Aur Timira KaJaga Se Nasha Karo
Jai Saraswati Mata
Dhupa Deepa Phala MewaMaa Swikara Karo
Gyanachakshu De MataJaga Nistara Karo
Jai Saraswati Mata
Maa Saraswati Ki AartiJo Koi Jana Gave
Hitakari SukhakariGyana Bhakti Pave
Jai Saraswati Mata
Jai Saraswati MataJai Jai Saraswati Mata
Sadaguna Vaibhava ShaliniTribhuvana Vikhyata
Jai Saraswati Mata`
},

{
  title: "Vishnu Aarti",
  deity: "Lord Vishnu",
  full: `Om Jai Jagadish Hare, Swami Jai Jagadish Hare |
Bhakta Jano Ke Sankat, Das Janon Ke Sankat, Kshan Me Dur Kare |
Om Jai Jagadish Hare ||
Jo Dhyave Phal Pave, Dhukh-Binse Man Ka |
Swami Dhukh-Binse Man Ka |
Sukh Sampati Ghar Aave (2), Kashta Mite Tan Ka |
Mata pita tum mere, Sharan gahun mai kis ki |
Swami sharan padun mai kis ki |
Tum bina aur na dooja (2), Aas karun mai kis ki |
Tum Puran Paramataa, Tum Antarayami |
Swami Tum Antarayami ||
Parabrahma Parameshwar (2), Tum Sab Ke Swami |
Tum Karuna Ke Sagar, Tum Palan-Karta |
Swami Tum Paalan-Karta |
Mai Murakh Phala-Kami, Mai Sevak Tum Swami, Kripa Karo Bharta |
Tum Ho Ek Agochar, Sabke Pran-Pati |
Swami Sabake Pran-Pati ||
Kis Vidh Milu Dayamay (2), Tumko Mai Kumati |
Dina-Bandhu Dukh-Harta, Thakur Tum Mere|
Swami Rakshak Tum Mere ||
Apne Hath Uthao, Apne Sharan Lagao Dwar Pada Tere |
Visay-Vikar Mitao, Paap Haro Devaa |
Swami Paap Haro Deva ||
Shraddha Bhakti Badhao (2), Santan Ki Seva |
Tan man dhan sab hai tera |
Swami sab kuch hai tera ||
Tera tujh ko arpan (2), Kya laage mera |`

},

{
  title: "Parvati Aarti",
  deity: "Goddess Parvati",
  full: `Jai Parvati Mata, Jai Parvati Mata, Brahma Sanatan Devi, Shubh Fal Ki Data ।
॥ Jai Parvati Mata...॥
Arikul Kantak Nasani, Nij Sevak Trata, Jagjanani Jagdamba, Harihar Gun Gata ।
॥ Jai Parvati Mata...॥
Singh Ko Vahan Saje, Kundal Hai Satha, Dev Vadhu Jas Gavat, Niratya Karat Ta Tha ।
॥ Jai Parati Mata...॥
Satyug Roop Atisundar, Nam Sati Kahlata, Hemanchal Ghar Janmi, Sakhiyan Sang Rata ।
॥ Jai Parvati Mata...॥
Shumbh Nishumbh Vidare, Hemachal Sthata, Sahastra Bhuja Tanu Dharike, Chakra Liyo Hatha ।
॥ Jai Parvati Mata...॥
Srashti Roop Tumhi Hai Janani, Shiv Sang Rang Rata, Nandi Bhringi Been Lahi, Sara Jag Madmata ।
॥ Jai Parvati Mata...॥
Devan Araj Karat Hum, Charan Dhyan Lata, Teri Kripa Rahe Too, Man Nahi Bharmata ।
॥ Jai Parvati Mata...॥
Maiya Ji Ki Aarati, Bhakti Bhav Se Jo Nar Gata, Nity Sukhi Rah Karake, Sukh  Sampatti Pata ।
॥ Jai Parvati Mata...॥
Jai Parvati Mata, Jai Parvati Mata, Brahma Sanatan Devi, Shubh Fal Ki Data ।`
},

{
    title: "Kali Aarti",
    deity: "Goddess Kali",
    full: `Karke Singh Sawari x2
Tere Bhakt Jano Par Mata
Bhid Padi Hai Bhari x2
Daanav Dal Par Toot Pado Maa
 Karke Singh Sawari
So So Singho Se Tu Bal Shali
Hai dus Bhujao Wali, Dukhyio ke dukhde haarti 
O Maiya, Hum Sab Utarey Teri Aarti
Ambe Tu Hai Jagdambe Kali
Jai Durge Khappar Wali
Tere Hi Gun Gaaye Bharati
Ambe Tu Hai Jagdambe Kali
Jai Durge Khappar Wali
Tere Hi Gun Gaaye Bharati
O Maiya, Hum Sab Utarey Teri Aarti
Maa Bete Ka Hai Is Jag Mein Bada Hi Nirmal Nata
Bada Hi Nirmal Nata
Poot Kaput Sune Hai Par Na Mata Suni Kumata
Maa Bete Ka Hai Is Jag Mein Bada Hi Nirmal Nata
Bada Hi Nirmal Nata
Poot Kaput Sune Hai Par Na Mata Suni Kumata
Sab Par Karuna Darshaney Wali, Amrut Barsaney Wali
Dukhiyon Ke Dukhdae Niharti
O Maiya, Hum Sab Utarey Teri Aarti
Ambe Tu Hai Jagdambe Kali
Jai Durge Khappar Wali
Tere Hi Gun Gaaye Bharati
Ambe Tu Hai Jagdambe Kali
Jai Durge Khappar Wali
Tere Hi Gun Gaaye Bharati
O Maiya, Hum Sab Utarey Teri Aarti`
  },
  
  {
    title: "Rama Aarti",
    deity: "Lord Rama",
    full: `Shri Rama Chandra Kripalu Bhajuman,Haran Bhavbhay Darunam।
Nav Kanj Lochan, kanj Mukh KarKanj Pad Kanjarunam॥
Shri Rama Chandra Kripalu Bhajuman...॥
Kandarp Aganit Amit Chhavi,Nav Neel Neerad Sundaram।
Pat Peet Maanahu Tadit Ruchi-ShuchiNaumi Janak Sutavaram॥
Shri Rama Chandra Kripalu Bhajuman...॥
Bhaju Deenbandhu DineshDanav Daitya Vansh Nikandanam।
Raghunand Anand Kand KaushalChandra Dasharath Nandanam॥
Shri Rama Chandra Kripalu Bhajuman...॥
Shir Mukut Kundal TilakCharu Udar Ang Vibhushanam।
Ajanubhuj Shar Chap-DharSangram Jit Khardushnam॥
Shri Rama Chandra Kripalu Bhajuman...॥
Iti Vadati Tulsidas,Shankar Shesh Muni Man Ranjanam।
Mam Hriday Kanj Nivas Kuru,Kaamadi Khal Dal Ganjanam॥
Shri Rama Chandra Kripalu Bhajuman...॥
Man Jahi Raacheu MilahiSo Var Sahaj Sundar Sanvaro।
Karuna Nidhaan SujaanSheel Saneh Janat Ravro॥
Shri Rama Chandra Kripalu Bhajuman...॥
Aehi Bhanti Gauri AsisSun Siy Hit Hiy Hiy Harshit Ali।
Tulsi Bhavanihi Poojee Puni PuniMudit Man Mandir Chali॥
Shri Rama Chandra Kripalu Bhajuman...॥`
  },
  
  {
    title: "Krishna Aarti",
    deity: "Lord Krishna",
    full: `Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki 
Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki 
Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki 
Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki 
Gale Mein Baijanti Mala, Bajave Murali Madhur Bala? 
Shravan Mein Kundal Jhalakala, Nand Ke Anand Nandlala? 
Gagan Sam Ang Kanti Kali, Radhika Chamak Rahi Aali?
Latan Mein Thadhe Banamali; 
Bhramar Si Alak, Kasturi Tilak, Chandra Si Jhalak; 
Lalit Chavi Shyama Pyari Ki? 
Shri Girdhar Krishna Murari Ki? 

Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki
Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki
Kanakmay Mor Mukut Bilse, Devata Darsan Ko Tarse? 
Gagan So Suman Raasi Barse; 
Baje Murchang, Madhur Mridang, Gwaalin Sang; Atual Rati Gop Kumaari Ki? Shri Girdhar Krishna Murari Ki? 
Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki
Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki
Jahaan Te Pragat Bhayi Ganga, Kalush Kali Haarini Shri Ganga? 
Smaran Te Hot Moh Bhanga; 
Basi Shiv Shish, Jataa Ke Beech, Harei Agh Keech; Charan Chhavi Shri Banvaari Ki? 
Shri Girdhar Krishna Murari Ki? 
Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki
Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki
Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki
Chamakati Ujjawal Tat Renu, Baj Rahi Vrindavan Benu? 
Chahu Disi Gopi Gwaal Dhenu; 
Hansat Mridu Mand, Chandani Chandra, Katat Bhav Phand; 
Ter Sun Deen Bhikhaaree Ki? 
Shri Girdhar Krishna Murari Ki? 
Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki?
Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki
Aarti Kunj Bihari Ki, Shri Girdhar Krishna Murari Ki
Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki
Aarti Kunj Bihari Ki Shri Girdhar Krishna Murari Ki`
  },


  ];

  return (
    <div style={styles.container}>
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
<img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <h1 style={styles.title}>🕉 Prayers</h1>
      <p style={styles.subtitle}>Tap to read full sacred aarti</p>

      <div style={styles.list}>
        {aartiList.map((item, index) => (
          <div key={index} style={styles.item}>
            <div
              style={styles.header}
              onClick={() => toggle(index)}
            >
              <div>
                <h3 style={styles.name}>{item.title}</h3>
                <span style={styles.deity}>{item.deity}</span>
              </div>
              <span style={styles.icon}>
                {openIndex === index ? "−" : "+"}
              </span>
            </div>

            {openIndex === index && (
              <div style={styles.body}>
                <pre style={styles.text}>{item.full}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prayers;

const styles = {
 container: {
  minHeight: "100vh",
  background: "linear-gradient(to bottom, #fff6ec, #ffffff)",
  padding: "70px 20px",
  fontFamily: "sans-serif",
  position: "relative",
  overflow: "hidden",
},


  title: {
    textAlign: "center",
    fontSize: "40px",
    color: "#ee6820",
    marginBottom: "10px",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: "40px",
  },

  list: {
    maxWidth: "850px",
    margin: "0 auto",
  },

 item: {
  background: "linear-gradient(to right, #ffb347, #ff7a18)",
  borderRadius: "14px",
  marginBottom: "18px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  overflow: "hidden",
},


  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 22px",
    cursor: "pointer",
  },

  name: {
    margin: 0,
    fontSize: "20px",
   color:" #fff"
  },

  deity: {
    fontSize: "14px",
    color: "white",
  },

  icon: {
    fontSize: "26px",
    color: "#ee6820",
    fontWeight: "600",
  },

  body: {
    borderTop: "1px solid #f1f1f1",
    padding: "20px",
    background: "#fffdf8",
  },

  text: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.9",
    fontSize: "15px",
    color: "black",
  },
  mandalaLeft: {
  position: "absolute",
  top: "-50px",
  left: "-180px",
  width: "750px",
  opacity: 0.15,
  zIndex: 0,
},

mandalaRight: {
  position: "absolute",
  top: "-50px",
  right: "-180px",
  width: "750px",
  opacity: 0.15,
  zIndex: 0,
},

};