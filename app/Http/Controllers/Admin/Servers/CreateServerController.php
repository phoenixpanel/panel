<?php

namespace PhoenixPanel\Http\Controllers\Admin\Servers;

use Illuminate\View\View;
use PhoenixPanel\Models\Node;
use PhoenixPanel\Models\Location;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Illuminate\View\Factory as ViewFactory;
use PhoenixPanel\Http\Controllers\Controller;
use PhoenixPanel\Repositories\Eloquent\NestRepository;
use PhoenixPanel\Repositories\Eloquent\NodeRepository;
use PhoenixPanel\Http\Requests\Admin\ServerFormRequest;
use PhoenixPanel\Services\Servers\ServerCreationService;

class CreateServerController extends Controller
{
    /**
     * CreateServerController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private NestRepository $nestRepository,
        private NodeRepository $nodeRepository,
        private ServerCreationService $creationService,
        private ViewFactory $view
    ) {
    }

    /**
     * Displays the create server page.
     *
     * @throws \PhoenixPanel\Exceptions\Repository\RecordNotFoundException
     */
    public function index(): View|RedirectResponse
    {
        $nodes = Node::all();
        if (count($nodes) < 1) {
            $this->alert->warning(trans('admin/server.alerts.node_required'))->flash();

            return redirect()->route('admin.nodes');
        }

        $nests = $this->nestRepository->getWithEggs();

        \JavaScript::put([
            'nodeData' => $this->nodeRepository->getNodesForServerCreation(),
            'nests' => $nests->map(function ($item) {
                return array_merge($item->toArray(), [
                    'eggs' => $item->eggs->keyBy('id')->toArray(),
                ]);
            })->keyBy('id'),
        ]);

        return $this->view->make('admin.servers.new', [
            'locations' => Location::all(),
            'nests' => $nests,
        ]);
    }

    /**
     * Create a new server on the remote system.
     *
     * @throws \Illuminate\Validation\ValidationException
     * @throws \PhoenixPanel\Exceptions\DisplayException
     * @throws \PhoenixPanel\Exceptions\Service\Deployment\NoViableAllocationException
     * @throws \PhoenixPanel\Exceptions\Service\Deployment\NoViableNodeException
     * @throws \Throwable
     */
    public function store(ServerFormRequest $request): RedirectResponse
    {
        $data = $request->except(['_token']);
        if (!empty($data['custom_image'])) {
            $data['image'] = $data['custom_image'];
            unset($data['custom_image']);
        }

        $server = $this->creationService->handle($data);

        $this->alert->success(trans('admin/server.alerts.server_created'))->flash();

        return new RedirectResponse('/admin/servers/view/' . $server->id);
    }
}


