import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth';
import { postService } from '@/services/postService';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Pagination from "react-js-pagination";

const Dashboard = () => {
    const [posts, setPosts] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const { query } = router
    const { user } = useAuth({ middleware: 'auth' })
    console.log(user);
    const handleChange = event => {
        setPosts(null)
        handleRouter(1)
        setSearchTerm(event.target.value);
    };

    const handleRouter = (pageNumber) => {
        router.query.page = pageNumber
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query }
            },
            undefined,
            {}
        )
    }
    const fetchPosts = () => postService.getAll(query?.page, searchTerm).then(res => setPosts(res.data));

    useEffect(() => {
        if(!router.isReady) return;
        fetchPosts();
    }, [router.isReady, searchTerm]);


    function deletePost(id) {
        postService.delete(id).then((res) => {
            setPosts(null);
            fetchPosts();
        });
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }>

            <Head>
                <title>Laravel - Dashboard</title>
            </Head>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                        <h1 className='float-left'>Posts</h1>
                        <div className='float-right'>
                            {user?.is_admin &&
                                <Link href="/posts/create">
                                    <a className="btn btn-success ">Create Post</a>
                                </Link>
                            }
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Search</span>
                            </div>
                            <input  type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={handleChange}
                                    className="form-control"
                            />
                        </div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Index</th>
                                    <th>Title</th>
                                    <th>Image</th>
                                    <th>Author</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts && posts.data.map((post, index) =>
                                    <tr key={post.id}>
                                        <td>{index+1}</td>
                                        <td>{post.title}</td>
                                        <td>
                                            <img src={post.image.thumbnail} />
                                        </td>
                                        <td>{post.author.name}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            <Link href={'/posts/'+post.id}>
                                                <a className="btn btn-sm btn-primary mr-1">Show</a>
                                            </Link>
                                            {post.can_user_manage &&
                                                <>
                                                    <Link href={'/posts/edit/'+post.id}>
                                                        <a className="btn btn-sm btn-info mr-1">Edit</a>
                                                    </Link>
                                                    <button onClick={() => deletePost(post.id)} className="btn btn-sm btn-danger btn-delete-post" disabled={post.isDeleting}>
                                                        {post.isDeleting
                                                            ? <span className="spinner-border spinner-border-sm"></span>
                                                            : <span>Delete</span>
                                                        }
                                                    </button>
                                                </>
                                            }
                                        </td>
                                    </tr>
                                )}
                                {!posts &&
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            <div className="spinner-border spinner-border-lg align-center"></div>
                                        </td>
                                    </tr>
                                }
                                {posts && !posts.data.length &&
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            <div className="p-2">No Posts To Display</div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        <div>
                                <Pagination
                                    activePage={posts?.meta?.current_page ? posts?.meta?.current_page : 0}
                                    itemsCountPerPage={posts?.meta?.per_page ? posts?.meta?.per_page : 0 }
                                    totalItemsCount={posts?.meta?.total ? posts?.meta?.total : 0}
                                    onChange={(pageNumber) => {
                                        setPosts(null)
                                        handleRouter(pageNumber)
                                        fetchPosts()
                                    }}
                                    pageRangeDisplayed={8}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    firstPageText="First Page"
                                    lastPageText="Last Page"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Dashboard
