import React, { useCallback, useEffect } from 'react'
import dataService from '../service/dataService'
import { useForm } from 'react-hook-form'
import {Input,Select,RealTimeEditor,Button} from '../componants'
import { useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({post}) {
     const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",   
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });
    const navigate=useNavigate()
    const userData=useSelector((state)=>state.auth.userData)
   

    const slugTransform = useCallback((value) => {
            if (value && typeof value === "string")
                return value
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-zA-Z\d\s]+/g, "-")
                    .replace(/\s/g, "-");
    
            return "";
        }, []);

        
    
    const submit = async (data) => {console.log("data",data)
        if (post) {
            const file = data.image[0] ? await dataService.uploadFile(data.image[0]) : null;

            if (file) {
                dataService.deleteFile(post.featuredImage);
            }

            const dbPost = await dataService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });
               

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await dataService.uploadFile(data.image[0]);
     //console.log("file",file)
            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
               // console.log("data feature",data)
               // console.log("fileId",userData.$id)
                //  userId  removed: todo
                const dbPost = await dataService.createPost({ ...data,userId:userData.userData.$id});

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };
    useEffect(() => {
        const superman = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        }); 

        return ()  =>{
        superman.unsubscribe()
    }
        }, [setValue, slugTransform,watch]);
    





    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RealTimeEditor label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={dataService.getFileUrl(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}

export default PostForm