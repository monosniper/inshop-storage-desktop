import globalStyles from "~/styles/global.css";
import styles from "~/styles/index.css";
import Layout from "~/components/Layout/Layout";
import {observer} from "mobx-react";
import {commitSession, getSession} from "~/sessions";
import {json, redirect} from "@remix-run/node";
import {getShops} from "~/models/shop.server";

export const action = async ({ request }) => {
    return null
}

export function links() {
    return [
        { rel: "stylesheet", href: globalStyles },
        { rel: "stylesheet", href: styles },
    ];
}

export const loader = async ({ request }) => {
    const { data: session } = await getSession(request.headers.get("Cookie"))

    let shops = await getShops(session.user.id);
    shops = shops.data.shops

    return json({
        user: session.user,
        domain: session.domain,
        shops
    });
};

const NewShop = observer(() => {
    return (
        <Layout>
            NewShop
        </Layout>
    );
})

export default NewShop