import { ButtonLight } from "@impulsogov/design-system";
import style from "../../styles/BackButton.module.css";

export default function BackButton() {
  return (
    <div className={style["button-container"]}>
      <ButtonLight
          icone={{
          posicao: 'right',
          url: 'https://media.graphassets.com/8NbkQQkyRSiouNfFpLOG'
          }}
          label="VOLTAR"
          link="/inicio"
      />
    </div>
  )
}
