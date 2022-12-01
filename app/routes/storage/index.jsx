import {json, redirect} from "@remix-run/node";
import {useActionData, useLoaderData} from "@remix-run/react";
import {getPositions, updatePosition} from "~/models/position.server";
import { getCategories } from "~/models/category.server";

import styles from "~/styles/global.css";
import Positions from "~/components/Positions";
import Layout from "~/components/Layout";
import storageIcon from "~/assets/icons/black_storage.svg";
import addIcon from "~/assets/icons/add.svg";
import {useEffect, useTransition} from "react";
import {toast} from "react-toastify";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader = async () => {
  return json({
    categories: await getCategories(),
    positions: await getPositions(),
  });
};

export const action = async ({ request }) => {
    const formData = await request.formData();

    const updated = await updatePosition({
        filters: { id: formData.get('id') },
        set: {
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            description: formData.get('description'),
            price: Number(formData.get('price')),
            inStock: Number(formData.get('inStock')),
            CategoryId: Number(formData.get('CategoryId')),
            priority: Number(formData.get('priority')),
            discount: Number(formData.get('discount')),
            discount_type: formData.get('discountType'),
            // properties: Object.fromEntries(formData.get('properties')),
        }
    });

    return updated
};

export default function Storage() {
  const data = useLoaderData();
    const actionData = useActionData();

    useEffect(() => {
        console.log(actionData)
        if(actionData && actionData.data && actionData.data.updatePosition) {
            toast('Изменения сохранены')
        }
    }, [actionData])

  return <Layout>
      <div className="title">
        <div className="title__left">
            <img src={storageIcon}/>
            Общий склад
        </div>
          <div className="title__right">
              <button className="btn">
                  <img src={addIcon}/>
                  Добавить позицию
              </button>
          </div>
      </div>
      <Positions
          positions={data.positions.data.positions}
          categories={data.categories.data.categories}
      />
  </Layout>;
}