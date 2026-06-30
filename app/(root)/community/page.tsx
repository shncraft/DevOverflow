import { UserCard } from "@/components/cards/user-card";
import DataRenderer from "@/components/data-renderer";
import LocalSearch from "@/components/search/local-search";
import ROUTES from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/states";
import { getUsersAction } from "@/lib/actions/user.action";

export default async function CommunityPage({ searchParams }: RouteParams) {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getUsersAction({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
    query,
  });

  const { users } = data || {};

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div>
        <LocalSearch
          route={ROUTES.COMMUNITY}
          iconPosition="left"
          imgSrc="/icons/search.svg"
          placeholder="There are some great devs here...."
          otherClasses="flex-1"
        />
      </div>

      <DataRenderer
        success={success}
        empty={EMPTY_USERS}
        data={users}
        error={error}
        render={(users) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {users.map((user) => (
              <UserCard key={user._id} {...user} />
            ))}
          </div>
        )}
      />
    </div>
  );
}
