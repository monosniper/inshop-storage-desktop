import globalStyles from "~/styles/global.css";
import styles from "~/styles/index.css";
import Layout from "~/components/Layout/Layout";
import {observer} from "mobx-react";
import {json} from "@remix-run/node";
import {getShops} from "~/models/shop.server";
import {requireUser} from "~/utils/session.server";
import {getSession} from "~/sessions";

export function links() {
    return [
        { rel: "stylesheet", href: globalStyles },
        { rel: "stylesheet", href: styles },
    ];
}

export const loader = async ({ request }) => {
    const user = await requireUser(request)
    const session = await getSession(request.headers.get('Cookie'))
    let shops = await getShops(user.id);
    console.log(shops)
    if(shops) shops = shops.data.shops
    else shops = []

    return json({
        user,
        domain: session.get('domain'),
        shops
    });
};

const Index = observer(() => {
    return (
        <Layout>

        </Layout>
    );
})

export default Index