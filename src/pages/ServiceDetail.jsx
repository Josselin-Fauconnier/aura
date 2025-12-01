import { useParams } from "react-router-dom";
import MockData from "../mocks/data.json";

const ServiceDetail = () => {
  const { key } = useParams(); // récupère le paramètre dans l'URL
  const category = MockData.categories_list.find((c) => c.key === key);

  if (!category) return <div>Catégorie introuvable</div>;

  // Ici tu peux afficher tout ce que tu veux pour cette catégorie
  return (
    <div>
      <h1>Détails de {category.name}</h1>
      <p>Description : {category.description}</p>
      {/* Tu peux aussi lister les services liés */}
      <ul>
        {MockData.services
          .filter((s) => s.category === key)
          .map((s) => (
            <li key={s.id_offer}>{s.name}</li>
          ))}
      </ul>
    </div>
  );
};

export default ServiceDetail;
