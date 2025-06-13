import { fetchAreasById, fetchFormalitiesBySlug } from "@/app/lib/data";
import AreaDetail from "@/app/ui/formality/area-detail";
import FormalityInfo from "@/app/ui/formality/formality-info";
import FormalityMedia from "@/app/ui/formality/formality-media";
import Banners from "@/app/ui/home/banners";
import LinkToBack from "@/app/ui/link-to-back";
import Link from "next/link";



export async function generateMetadata({ params, searchParams }, parent) {
  // read route params
  const  { slug }  = await params
 
  // fetch data
  const formality = await fetchFormalitiesBySlug(slug);
  

  return {
    title: formality.title,
  
  }

}

export default async function Formality({ params }) {
  const slug = params.slug;
  const formality = await fetchFormalitiesBySlug(slug);
  const area = await fetchAreasById(formality.area_id);
  //console.log(area);
  if (!formality) {
    return "nada por aqui";
  }
  return (
    
    <main className="formality">
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-md-7">
            <h4>
              <i className="fa-solid fa-layer-group"></i>{" "}
              {formality.category.name}
            </h4>
            <h3>{formality.title}</h3>
            <p
              className="lead"
              dangerouslySetInnerHTML={{ __html: formality.summary }}
            ></p>
            {formality.online == 1 ? (
              <>
                <p className="text-primary mt-4 mb-3">
                  Este trámite se puede realizar de manera online
                </p>
                <div className="d-flex justify-content-between">
                  <a
                    href={formality.url}
                    className="btn btn-lg btn-primary text-white"
                    target="_blank"
                  >
                    Iniciar trámite online
                  </a>
                  <LinkToBack variant="btn-link" />
                </div>
              </>
            ) : (
              <LinkToBack variant="btn-link p-0" />
            )}
            <hr />

            {/* procedure */}
            {formality.procedure ? (
              <FormalityInfo title="Procedimiento" text={formality.procedure} />
            ) : (
              ""
            )}
            {/* requirements	who	when	previous	cost time	more */}
            {/* requirements */}
            {formality.requirements ? (
              <FormalityInfo
                title="Requerimientos"
                text={formality.requirements}
              />
            ) : (
              ""
            )}
            {/* who */}
            {formality.who ? (
              <FormalityInfo title="Quién puede hacerlo" text={formality.who} />
            ) : (
              ""
            )}
            {/* when */}
            {formality.when ? (
              <FormalityInfo title="Dónde se realiza" text={formality.when} />
            ) : (
              ""
            )}
            {/* previous */}
            {formality.previous ? (
              <FormalityInfo
                title="¿Requiere trámites previos?"
                text={formality.previous}
              />
            ) : (
              ""
            )}
            {/* cost */}
            <div className="formality-info">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Costo</h5>
                  <div />
                  {formality.cost && formality.cost != 2 ? (
                    <span>
                      El trámite tiene costo, sugerimos contactarse con el área
                      responsable para consultar sobre las tasas vigentes
                    </span>
                  ) : (
                    <span>El trámite no tiene costo</span>
                  )}
                </div>
              </div>
            </div>

            {/* time */}
            {formality.time ? (
              <FormalityInfo
                title="¿Cuánto tiempo demora?"
                text={formality.time}
              />
            ) : (
              ""
            )}
            {/* more */}
            {formality.more ? (
              <FormalityInfo title="Más info" text={formality.more} />
            ) : (
              ""
            )}
            {/* media */}
            {formality.media.length > 0 ? (
              <FormalityMedia media={formality.media} />
            ) : (
              ""
            )}
          </div>
          <div className="col-md-4">
            <AreaDetail area={area} formality={formality} />
            <Banners type={"box"} />
          </div>
        </div>
      </div>
    </main>
  );
}
