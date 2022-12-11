import globalStyles from "~/styles/global.css";
import styles from "~/styles/index.css";
import Layout from "~/components/Layout/Layout";
import {observer} from "mobx-react";
import {commitSession, getSession} from "~/sessions";
import {json, redirect} from "@remix-run/node";
import {getShops} from "~/models/shop.server";
import {requireUser} from "~/utils/session.server";

export const action = async ({ request }) => {
    const formData = await request.formData();
    const domain = formData.get('domain')

    const session = await getSession(request.headers.get('Cookie'))

    session.set('domain', domain)

    return redirect('/home', {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export function links() {
    return [
        { rel: "stylesheet", href: globalStyles },
        { rel: "stylesheet", href: styles },
    ];
}

export const loader = async ({ request }) => {
    const user = await requireUser(request)

    let shops = await getShops(user.id);
    shops = shops.data.shops

    const session = await getSession(request.headers.get('Cookie'))

    return json({
        user,
        domain: session.get('domain'),
        shops
    });
};

const Home = observer(() => {
    return (
        <Layout>
            home
        </Layout>
    );
})

export default Home