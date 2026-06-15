import { useParams } from "react-router";
import { useSerie } from "../../../../hooks/useSerie";
import { EditSerieForm } from "../../../../components/series/EditSerieForm";

function EditSerie() {
  const { id } = useParams();
  const { serie, isLoading: isLoadingSerie } = useSerie({ id: id || "" });

  if (isLoadingSerie || !serie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-medium-gray">loading...</p>
      </div>
    );
  }

  return <EditSerieForm key={id} serie={serie} id={id!} />;
}

export { EditSerie };
