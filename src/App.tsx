import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Label } from "./components/ui/label";
import { ArrowUpRight, Circle, Earth } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { formatarData } from "./utils/format-date.utils";

const baseUrl = "https://api.github.com";

function App() {
  const [commits, setCommits] = useState<{
    total_count: number;
    items: any[];
  } | null>(null);
  const [repositories, setRepositories] = useState<any[]>([]);
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
    const userName = "ThiagoHeckler";
    getUser(userName);
    getCommmits(userName);
    getRepositories(userName);
  }, []);

  return (
    <>
      <div className="z-10 fixed -right-16 top-64 w-[calc(100vw+10rem)] h-[calc(100vw+10rem)] bg-violet-800 blur-[10rem] opacity-15 rounded-full" />
      <div className="relative z-20 w-full h-dvh">
        <div className="flex justify-center w-screen h-full">
          <div className="flex flex-col items-center">
            <div className="z-30 w-8 h-14 bg-blue-800" />
            <div className="z-30 w-12 h-8 bg-gray-900 rounded-md" />
            <div className="z-30 w-5 h-6 bg-gray-900 rounded-b-sm" />
            <div className="z-20 w-12 h-4 bg-white border-4 border-gray-200 rounded-full -m-2" />
            <div className="z-10 flex flex-col w-[22rem] h-[32rem] bg-muted border-2 border-gray-200 rounded-3xl -m-4 p-4 pt-9 pb-0">
              <main className="bg-background w-full h-full flex flex-col justify-between p-4 rounded-xl">
                <div className="flex flex-col gap-y-4">
                  <div className="w-full h-1 bg-gradient-to-r from-green-500 to-green-300 rounded-full" />
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
                        className="w-2 h-2 fill-green-500 animate-pulse stroke-none mb-1"
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
                  <h5>
                    {/* {repositories.length &&
                      repositories.reduce(
                        (e, t) =>
                          t.language &&
                          (e[t.language] = (e[t.language] || 0) + 1)
                      )} */}
                  </h5>
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
                <Button variant="outline" className="h-7 rounded-full">
                  <Label
                    htmlFor="share"
                    className="text-[0.6rem] text-blue-700 font-black pointer-events-none"
                  >
                    Share
                  </Label>
                  <ArrowUpRight
                    id="share"
                    className="stroke-2 size-4 text-muted-foreground"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
