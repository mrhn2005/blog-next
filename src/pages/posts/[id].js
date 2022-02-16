import AppLayout from '@/components/Layouts/AppLayout'
import { postService } from '@/services/postService';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const [post, setPost] = useState(null);
    const router = useRouter();
    const { id } = router.query

    useEffect(() => {
        if(!router.isReady) return;
        postService.getById(id).then(res => setPost(res.data));
    }, [router.isReady]);

    return (
        <AppLayout>

            <Head>
                <title>{post?.data?.title}</title>
            </Head>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {post &&
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{post.data.title}</h5>
                            <p className="card-text">{post.data.content}</p>
                            <p className="card-text"><small className="text-muted">Create at: {post.data.created_at}</small></p>
                        </div>
                        <img src={post.data.image.original} className="card-img-top h-50"/>
                    </div>
                    }
                    {!post &&
                        <div className="text-center">
                            <div className="spinner-border spinner-border-lg align-center"></div>
                        </div>
                    }
                </div>
            </div>
        </AppLayout>
    )
}

export default Dashboard
