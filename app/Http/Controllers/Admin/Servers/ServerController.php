<?php

namespace PhoenixPanel\Http\Controllers\Admin\Servers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use PhoenixPanel\Models\Server;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use PhoenixPanel\Http\Controllers\Controller;
use PhoenixPanel\Models\Filters\AdminServerFilter;
use Illuminate\Contracts\View\Factory as ViewFactory;

use PhoenixPanel\app\Services\ServerAllocationService;

class ServerController extends Controller
{
    /**
     * ServerController constructor.
     */
    public function __construct(private ViewFactory $view)
    {
    }

    /**
     * Returns all the servers that exist on the system using a paginated result set. If
     * a query is passed along in the request it is also passed to the repository function.
     */
    public function index(Request $request): View
    {
        $servers = QueryBuilder::for(Server::query()->with('node', 'user', 'allocation'))
            ->allowedFilters([
                AllowedFilter::exact('owner_id'),
                AllowedFilter::custom('*', new AdminServerFilter()),
            ])
            ->paginate(config()->get('phoenixpanel.paginate.admin.servers'));

        return $this->view->make('admin.servers.index', ['servers' => $servers]);
    }

    /**
     * Allocates ports for a server.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $server
     * @return \Illuminate\Http\JsonResponse
     */
    public function allocatePorts(Request $request, int $server): \Illuminate\Http\JsonResponse
    {
        try {
            $server = Server::findOrFail($server);
            $numPorts = $request->input('ports');
            \Log::debug('CSRF Token: ' . $request->input('_token')); // Add logging for CSRF token
            if (!$numPorts) {
                return response()->json(['error' => 'Number of ports is required'], 400);
            }
            app(ServerAllocationService::class)->allocatePorts($server, $numPorts);

            return response()->json(['message' => 'Ports allocated successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
