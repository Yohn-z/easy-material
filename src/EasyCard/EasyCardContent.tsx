import { useEffect } from "react";
import { useAddItem } from "./EasyCard";

import { EasyCardContentItem,AddItemFucType } from "./EasyCard";

export const EasyCardContent = (props: EasyCardContentItem) => {
    const addItem: AddItemFucType | undefined = useAddItem()

    useEffect(() => {
      if(addItem) {
        addItem(props)
      }
    }, [props])
}