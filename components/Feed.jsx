"use client";
import React from "react";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
    return (
        <div className="mt-16 prompt_layout">
            {data.map((post) => (
                <PromptCard
                    key={post._id}
                    post={post}
                    handleTagClick={handleTagClick}
                />
            ))}
        </div>
    );
};

const Feed = () => {
    const [searchText, setSearchText] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [searchResult, setSearchResult] = useState([]);

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch("/api/prompt");
            const data = await response.json();
            setPosts(data);
        };
        fetchPosts();
    }, []);

    const filterPrompts = (searctext) => {
        const regex = new RegExp(searctext, "i");
        return posts.filter(
            (item) =>
                regex.test(item.creator.username) ||
                regex.test(item.tag) ||
                regex.test(item.prompt)
        );
    };
    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);
        console.log(searchText);
        console.log(searchResult);
        setSearchTimeout(
            setTimeout(() => {
                const searchResult = filterPrompts(e.target.value);
                setSearchResult(searchResult);
            }, 500)
        );
    };
    const handleTagClick = (tagName) => {
        setSearchText(tagName);
        const searchResult = filterPrompts(tagName);
        setSearchResult(searchResult);
    };

    return (
        <section className="feed">
            <form action="" className="relative w-full flex-center">
                <input
                    type="text"
                    placeholder="Search for promps"
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className="search_input peer"
                />
            </form>

            {searchText ? (
                <PromptCardList
                    data={searchResult}
                    handleTagClick={handleTagClick}
                />
            ) : (
                <PromptCardList data={posts} handleTagClick={handleTagClick} />
            )}
        </section>
    );
};

export default Feed;
