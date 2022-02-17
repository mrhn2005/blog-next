import AuthValidationErrors from '@/components/AuthValidationErrors'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Label from '@/components/Label'
import { useEffect, useRef, useState } from 'react'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'
import { postService } from '@/services/postService'

const Register = () => {
    const [title, setTitle] = useState('')
    const [selectedFile, setSelectedFile] = useState(null);
    const [content, setContent] = useState(null)
    const [errors, setErrors] = useState([])
    const [message, setMessage] = useState('')
    const ref = useRef();
    const submitForm = event => {
        event.preventDefault()
        setErrors([])
        setMessage('')
        const formData = new FormData();
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        formData.append('title', title);
        formData.append('content', content);
        const config = {
            headers:{ "Content-Type": "multipart/form-data" }
        };
        axios
            .post('/api/posts', formData, config)
            .then(() => {
                setMessage('Post Created Successfully')
                resetForm()
            })
            .catch(error => {
                console.log(error.response)
                if (error.response.status !== 422) throw error

                setErrors(Object.values(error.response.data.errors).flat())
            })
    }
    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0])
        console.log(selectedFile)
    }

    const resetForm = () => {
        setContent('')
        setTitle('')
        setSelectedFile(null)
        ref.current.value = ''
    }
    return (
        <AppLayout>

            <Head>
                <title>Create Post</title>
            </Head>

            <div className="card mx-5 mt-5">
                <div className="card-header">
                    Create Post
                </div>
                <div className="card-body">
                    {/* Validation Errors */}
                    <AuthValidationErrors className="mb-4" errors={errors} />

                    {message &&
                        <div className="font-medium text-green-600">
                            {message}
                        </div>
                    }

                    <form onSubmit={submitForm}>
                        {/* Name */}
                        <div>
                            <Label htmlFor="title">Title</Label>

                            <Input
                                id="title"
                                type="text"
                                value={title}
                                className="block mt-1 w-full"
                                onChange={event => setTitle(event.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        {/* Content Address */}
                        <div className="mt-4">
                            <Label htmlFor="content">Content</Label>

                            <Input
                                id="content"
                                type="text"
                                value={content ?? ''}
                                className="block mt-1 w-full"
                                onChange={event => setContent(event.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <input required type="file" onChange={handleFileSelect} ref={ref} accept="image/png, image/jpeg"/>
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <Button className="ml-4">Submit</Button>
                        </div>
                    </form>
                </div>
            </div>

        </AppLayout>
    )
}

export default Register
