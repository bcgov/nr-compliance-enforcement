import { FC, useState, useEffect } from "react";
import { useAppSelector } from "@hooks/hooks";
import { isFeatureActive } from "@store/reducers/app";
import { FEATURE_TYPES } from "@constants/feature-flag-types";
import { NotAuthorized } from "@components/containers/pages";

const compliments = [
  "Your dedication to protecting our natural environment makes a real difference.",
  "Thank you for your outstanding work safeguarding British Columbia's natural heritage.",
  "Your commitment to environmental stewardship is truly inspiring.",
  "The community appreciates your efforts in protecting our shared resources.",
  "Your expertise and care for the environment doesn't go unnoticed.",
  "You're making the world a better place, one case at a time.",
  "Your passion for environmental protection shines through in everything you do.",
  "Thank you for being a guardian of our natural spaces.",
  "Your work helps preserve our environment for future generations.",
  "Your vigilance protects our precious natural resources from harm.",
  "Every investigation you complete makes our province safer and cleaner.",
  "Your attention to detail in environmental cases is remarkable.",
  "You bring justice to those who harm our natural world.",
  "Your work ensures our environment can thrive for years to come.",
  "Thanks to you, our forests, parks, and waterways are better protected.",
  "Your dedication to environmental law enforcement is admirable.",
  "You're a true champion of environmental protection.",
  "Your efforts help maintain the delicate balance of our ecosystems.",
  "Your professionalism in handling environmental cases is exemplary.",
  "You make a difference in protecting our natural legacy.",
  "Your commitment to environmental protection inspires others to care.",
  "You're fighting the good fight for our planet's future.",
  "Your work protects the natural heritage we all share.",
  "Every case you solve helps preserve our environment.",
  "Your expertise in environmental law is invaluable.",
  "You're making our natural areas safer for everyone to enjoy.",
  "Thank you for standing up for environmental protection.",
  "Your investigations protect our parks, forests, and wildlife.",
  "You're a guardian of British Columbia's natural beauty.",
  "Your work ensures future generations can enjoy clean air and water.",
  "You bring hope to environmental protection efforts everywhere.",
  "Your dedication helps preserve our natural legacy.",
  "Thank you for your tireless work protecting our environment.",
  "Your efforts help maintain healthy ecosystems throughout BC.",
  "You're making a real impact on environmental protection.",
  "Your work protects the intricate web of life in our province.",
  "Your investigations prevent countless acts of environmental harm.",
  "Thank you for your unwavering commitment to nature.",
  "Your work helps preserve critical habitats and parklands.",
  "You're making our world a safer place for all living things.",
  "Your dedication to environmental justice is inspiring.",
  "You protect the natural treasures we all cherish.",
  "Your work ensures environmental laws are respected and enforced.",
  "Thank you for being a voice for environmental protection.",
  "Your efforts help maintain ecological balance in our province.",
  "You're a true steward of our natural resources.",
  "Your work protects endangered species and sensitive areas.",
  "Thank you for your professional excellence in environmental protection.",
  "Your investigations help deter environmental crimes.",
  "You're helping to build a more sustainable future for BC.",
  "Your work protects the natural beauty we all love.",
  "Thank you for your courage in environmental enforcement.",
  "Your dedication helps preserve green spaces for recreation.",
  "You're making our parks and natural areas safer for visitors.",
  "Your work protects water quality and clean air for all.",
  "Thank you for your commitment to environmental integrity.",
  "Your efforts help combat pollution and environmental damage.",
  "You're a protector of our province's biodiversity.",
  "Your work ensures healthy environments for all British Columbians.",
  "Thank you for your vigilance in environmental protection.",
  "Your investigations protect sensitive environmental areas.",
  "You're making a difference one environmental case at a time.",
  "Your work helps preserve our natural inheritance.",
  "Thank you for your dedication to environmental law.",
  "Your efforts protect both natural areas and park visitors.",
  "You're a guardian of our environmental future.",
  "Your work helps maintain the health of our ecosystems.",
  "Thank you for your professional approach to environmental protection.",
  "Your investigations protect rare and endangered habitats.",
  "You're helping to preserve our natural world for everyone.",
  "Your work ensures clean environments for current and future generations.",
  "Thank you for your commitment to environmental protection.",
  "Your efforts help maintain natural balance in our parks and forests.",
  "You're a champion of sustainable environmental management.",
  "Your work protects the environment for all species and visitors.",
  "Thank you for your expertise in environmental law enforcement.",
  "Your investigations help preserve ecological diversity.",
  "You're making our natural areas more secure and sustainable.",
  "Your work protects the natural systems that sustain life.",
  "Thank you for your dedication to habitat conservation.",
  "Your efforts help prevent environmental degradation.",
  "You're a protector of our planet's living resources.",
  "Your work ensures natural areas remain pristine and accessible.",
  "Thank you for your vigilance against environmental crimes.",
  "Your investigations protect both common and rare natural areas.",
  "You're helping to preserve our ecological heritage.",
  "Your work protects the natural processes that keep our environment healthy.",
  "Thank you for your commitment to conservation and protection.",
  "Your efforts help maintain healthy natural environments.",
  "You're a defender of our natural world.",
  "Your work protects the complex relationships within our ecosystems.",
  "Thank you for your professional environmental enforcement.",
  "Your investigations help preserve ecosystem services we all depend on.",
  "You're making our environment safer for all creatures and visitors.",
  "Your work protects the natural cycles that sustain life.",
  "Thank you for your dedication to environmental welfare.",
  "Your efforts help combat environmental destruction and pollution.",
  "You're a guardian of our province's natural wealth.",
  "Your work ensures sustainable use of our natural resources.",
  "Thank you for your commitment to environmental law and protection.",
  "Your investigations protect vulnerable natural areas.",
  "You're helping to preserve our natural diversity.",
  "Your work protects the habitats that wildlife and visitors depend on.",
  "Thank you for your vigilance in environmental enforcement.",
  "Your efforts help maintain ecological integrity across BC.",
  "You're a protector of our environmental treasures.",
  "Your work ensures our natural areas can thrive and be enjoyed safely.",
  "Thank you for your dedication to nature's protection.",
  "Your investigations help preserve our wild spaces and parks.",
  "You're making a lasting impact on environmental conservation.",
  "Your work protects the beauty of our natural world.",
  "Thank you for your commitment to environmental stewardship.",
  "Your efforts help ensure a sustainable future for our province.",
  "You're a true friend to the environment and all who enjoy it.",
  "Your work protects the natural resources we all depend on.",
  "Thank you for your professional environmental protection efforts.",
  "Your investigations help preserve our planet's health.",
  "You're making our world a better place for all life.",
  "Your work protects the sanctity of our natural areas and parks.",
  "Thank you for your unwavering environmental dedication.",
  "Your efforts help maintain the wonder of our wild places and protected areas.",
  "Your dedication to wildlife conservation saves countless animal lives.",
  "Thank you for protecting BC's incredible biodiversity.",
  "Your work ensures wildlife can roam freely and safely.",
  "You're a true guardian of our province's magnificent wildlife.",
  "Your conservation efforts help endangered species recover.",
  "Thank you for monitoring and protecting wildlife populations.",
  "Your expertise in wildlife management is invaluable to conservation.",
  "You help maintain the delicate balance between humans and wildlife.",
  "Your wildlife investigations prevent cruelty and illegal activities.",
  "Thank you for ensuring wildlife habitats remain intact.",
  "Your work protects migration corridors for countless species.",
  "You're making a difference in the fight against wildlife trafficking.",
  "Your conservation knowledge helps species adapt and thrive.",
  "Thank you for your vigilance in protecting threatened species.",
  "Your work ensures genetic diversity is preserved for future generations.",
  "You help resolve human-wildlife conflicts with compassion and expertise.",
  "Your conservation efforts protect both predators and prey.",
  "Thank you for safeguarding breeding grounds and nesting sites.",
  "Your wildlife monitoring provides crucial data for conservation decisions.",
  "You're helping to restore populations of at-risk species.",
  "Your work protects the complex food webs that sustain ecosystems.",
  "Thank you for educating the public about wildlife conservation.",
  "Your efforts help reduce human impact on wildlife communities.",
  "You're a champion for animals who cannot speak for themselves.",
  "Your conservation work protects both common and rare species.",
  "Thank you for ensuring hunting and fishing remain sustainable.",
  "Your wildlife enforcement deters poaching and illegal hunting.",
  "You help maintain healthy predator-prey relationships in nature.",
  "Your conservation efforts protect keystone species that support entire ecosystems.",
  "Thank you for your role in species recovery and rehabilitation programs.",
  "Your work ensures wildlife can access clean water and food sources.",
  "You protect the natural behaviors and instincts of wild animals.",
  "Your conservation knowledge helps adapt to climate change impacts.",
  "Thank you for protecting wildlife during their most vulnerable times.",
  "Your efforts help maintain natural selection and evolutionary processes.",
  "You're safeguarding the intricate relationships between species.",
  "Your wildlife work protects both terrestrial and aquatic animals.",
  "Thank you for ensuring sustainable wildlife management practices.",
  "Your conservation efforts help species recolonize their historic ranges.",
  "You protect the seasonal cycles that wildlife depend on.",
  "Your work maintains the natural instincts and behaviors of wild animals.",
  "Thank you for protecting wildlife corridors that connect fragmented habitats.",
  "Your conservation expertise helps balance ecological relationships.",
  "You ensure wildlife can adapt to changing environmental conditions.",
  "Your efforts protect the natural rhythms and patterns of wildlife.",
  "Thank you for safeguarding the future of BC's iconic species.",
  "Your wildlife work helps maintain ecosystem services we all depend on.",
  "You protect the remarkable diversity of life in our province.",
  "Your conservation efforts ensure wildlife remains wild and free.",
  "Thank you for being a voice for all the creatures who share our world.",
];

const Compliments: FC = () => {
  const isFeatureEnabled = useAppSelector(isFeatureActive(FEATURE_TYPES.COMPLIMENTS));
  const [randomCompliment, setRandomCompliment] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * compliments.length);
    setRandomCompliment(compliments[randomIndex]);
  }, []);

  if (!isFeatureEnabled) {
    return <NotAuthorized />;
  }

  return (
    <div className="comp-page-container comp-page-container--noscroll">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h1>Compliments</h1>
        </div>
      </div>

      <div className="comp-data-container">
        <div className="comp-data-list-map">
          <div className="comp-map-container">
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center">
                <div className="mb-3">
                  <i
                    className="bi bi-heart-fill"
                    style={{ fontSize: "3rem", color: "#e91e63" }}
                  ></i>
                </div>
                <h4 className="text-primary mb-3">A Compliment for You!</h4>
                <div
                  className="card mx-auto border-0"
                  style={{ maxWidth: "500px" }}
                >
                  <div className="card-body">
                    <p className="card-text fs-5 text-dark mb-0">"{randomCompliment}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compliments;
