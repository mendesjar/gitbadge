import { FormEvent, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Label } from "./components/ui/label";
import { Circle, Earth, Moon, Search, Sun } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { formatarData } from "./utils/format-date.utils";
import logomarca from "/public/gm.svg";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./components/ui/drawer";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

const baseUrl = "https://api.github.com";

function App() {
  const [userName, setUserName] = useState("");
  const [openDrawer, setOpenDrawer] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [commits, setCommits] = useState<{
    total_count: number;
    items: any[];
  } | null>(null);
  const [repositories, setRepositories] = useState<
    {
      language: string | null;
    }[]
  >([]);
  const [user, setUser] = useState<{
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
    name: string;
    company: string | null;
    blog: string;
    location: string | null;
    email: string | null;
    hireable: string | null;
    bio: string;
    twitter_username: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
  } | null>(null);

  async function getUser(username: string) {
    const apiData = await fetch(`${baseUrl}/users/${username}`);
    const apiResult = await apiData.json();
    setUser(apiResult);
    return apiResult;
  }

  async function getCommmits(username: string) {
    const date = formatarData();
    const apiData = await fetch(
      `${baseUrl}/search/commits?q=author:${username}+committer-date:%3E=${date}`
    );
    const apiResult = await apiData.json();
    setCommits(apiResult);
    return apiResult;
  }

  async function getRepositories(username: string) {
    const apiData = await fetch(
      `${baseUrl}/users/${username}/repos?per_page=100&sort=pushed`
    );
    const apiResult = await apiData.json();
    setRepositories(apiResult);
    return apiResult;
  }

  useEffect(() => {
    if (!openDrawer && !userName && !user?.id) {
      setOpenDrawer(true);
    }
  }, [openDrawer]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (userName) {
      getUser(userName);
      getCommmits(userName);
      getRepositories(userName);
    }
    setOpenDrawer(false);
  }

  function handleChangeTheme() {
    if (localStorage.theme === "dark" || !("theme" in localStorage)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (localStorage.theme === "dark") {
      localStorage.theme = "light";
      setTheme("light");
    } else {
      localStorage.theme = "dark";
      setTheme("dark");
    }
  }

  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "k") {
      setUserName("");
      setOpenDrawer(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
  });

  return (
    <>
      <div className="z-10 fixed -right-16 top-64 w-[calc(100vw+10rem)] h-[calc(100vw+10rem)] bg-violet-800 blur-[10rem] opacity-15 rounded-full" />
      <div className="relative z-20 w-full h-dvh">
        <div className="flex justify-center w-screen h-full">
          <div className="flex flex-col items-center">
            <div className="z-30 w-8 h-14 bg-green-800 dark:bg-green-300" />
            <div className="z-30 w-12 h-8 bg-gray-900 dark:bg-gray-400 rounded-md" />
            <div className="z-30 w-5 h-6 bg-gray-900 dark:bg-gray-400 rounded-b-sm" />
            <div className="z-20 w-12 h-4 bg-background border-4 border-gray-200 dark:border-gray-600 rounded-full -m-2" />
            <div className="z-10 flex flex-col w-[22rem] h-[32rem] bg-muted border-2 border-gray-200 dark:border-gray-600 rounded-3xl -m-4 p-4 pt-9 pb-0">
              <main className="bg-background w-full h-full flex flex-col justify-between p-4 rounded-xl">
                {user?.id && (
                  <>
                    <div className="flex flex-col gap-y-4">
                      <div className="w-full h-1 bg-gradient-to-r from-green-500 to-green-300 dark:from-green-300 dark:to-green-100 rounded-full" />
                      <header className="flex items-end justify-between w-full">
                        <div className="flex items-center gap-x-2">
                          <Avatar id="avatar">
                            <AvatarImage src={user?.avatar_url} />
                            <AvatarFallback>{user?.login}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <Label
                              htmlFor="avatar"
                              className="text-[0.8rem] font-bold text-primary"
                            >
                              {user?.name}
                            </Label>
                            <Label
                              htmlFor="avatar"
                              className="text-[0.6rem] leading-3 text-muted-foreground w-28 max-h-6 overflow-hidden text-ellipsis"
                            >
                              {user?.bio}
                            </Label>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Circle
                            id="commits"
                            className="w-2 h-2 fill-green-500 dark:fill-green-300 animate-pulse stroke-none mb-1"
                          />
                          <Label
                            htmlFor="commits"
                            className="text-[0.6rem] text-muted-foreground capitalize"
                          >
                            commits (30d)
                          </Label>
                          <Label
                            htmlFor="commits"
                            className="text-[0.6rem] font-bold text-primary capitalize"
                          >
                            {commits?.total_count || 0} commits
                          </Label>
                        </div>
                      </header>
                    </div>
                    <main>
                      <p className="text-[0.6rem]">@{user?.login}</p>
                      <h1 className="bg-gradient-to-r from-green-500 to-green-300 dark:from-green-300 dark:to-green-100 text-transparent bg-clip-text font-black text-4xl text-wrap w-full break-words capitalize">
                        Developing dreams
                      </h1>
                    </main>
                    <div className="text-primary">
                      <Label className="text-[0.8rem] font-extrabold text-muted-foreground">
                        Code: {user.id}
                      </Label>
                      <div
                        id="languages"
                        className="flex flex-col text-[0.6rem] gap-y-1 my-3 font-extrabold"
                      >
                        Top languages
                        <Label
                          htmlFor="languages"
                          className="text-muted-foreground"
                        >
                          {Object.entries(
                            repositories.reduce<{ [key: string]: number }>(
                              (acc, repo) => {
                                if (repo.language) {
                                  acc[repo.language] =
                                    (acc[repo.language] || 0) + 1;
                                }
                                return acc;
                              },
                              {}
                            )
                          )
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map((entry) => entry[0])
                            .join(", ")}
                        </Label>
                      </div>
                      <div className="badges flex gap-x-2 flex-wrap">
                        <div className="w-max">
                          <Badge
                            variant="outline"
                            className="text-[0.6rem] rounded-full capitalize"
                          >
                            {user?.public_repos} repositories
                          </Badge>
                        </div>
                        <div className="w-max">
                          <Badge
                            variant="outline"
                            className="text-[0.6rem] rounded-full capitalize"
                          >
                            {user?.public_gists} gists
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </main>
              <div className="flex items-center justify-between w-full h-12 px-4">
                {user?.location && (
                  <div className="flex items-center space-x-2">
                    <Earth
                      id="location"
                      className="stroke-2 size-4 text-muted-foreground"
                    />
                    <Label
                      htmlFor="location"
                      className="text-[0.6rem] text-muted-foreground"
                    >
                      {user?.location}
                    </Label>
                  </div>
                )}
                <img
                  src={logomarca}
                  className="h-1/3 dark:brightness-200"
                  alt="logo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Username</DrawerTitle>
              <DrawerDescription>Enter GitHub username</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-12">
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="text"
                    autoFocus
                    placeholder="Enter Username"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <Button type="submit">Enter</Button>
                </div>
              </form>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      <Button
        variant="outline"
        size="icon"
        className="z-40 fixed bottom-5 left-5"
        onClick={() => handleChangeTheme()}
      >
        {theme === "dark" ? (
          <Moon className="stroke-[3]" />
        ) : (
          <Sun className="stroke-[3]" />
        )}
      </Button>
      <Button
        variant="outline"
        className="z-40 fixed bottom-5 right-5"
        onClick={() => {
          setUserName("");
          setOpenDrawer(true);
        }}
      >
        <span className="hidden md:block">ctrl + k</span>{" "}
        <Search className="stroke-[3] scale-105" />
      </Button>
    </>
  );
}

export default App;
