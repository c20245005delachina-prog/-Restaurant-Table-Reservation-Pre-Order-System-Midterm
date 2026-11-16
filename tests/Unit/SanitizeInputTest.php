<?php

namespace Tests\Unit;

use App\Http\Middleware\SanitizeInput;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class SanitizeInputTest extends TestCase
{
    public function test_it_sanitizes_text_recursively_in_body_and_query_but_preserves_credentials(): void
    {
        $request = Request::create('/?filter=%20%20Lunch%3Cb%3E%3C%2Fb%3E%20', 'POST', [
            'name' => '  Ada   <b>Lovelace</b>  ',
            'password' => '  <b> keep exactly </b>  ',
            'items' => [
                ['label' => "  Soup\tSpecial  "],
            ],
            'quantity' => 2,
        ]);

        (new SanitizeInput)->handle($request, static fn () => new Response);

        $this->assertSame('Ada Lovelace', $request->input('name'));
        $this->assertSame('  <b> keep exactly </b>  ', $request->input('password'));
        $this->assertSame('Soup Special', $request->input('items.0.label'));
        $this->assertSame(2, $request->input('quantity'));
        $this->assertSame('Lunch', $request->query('filter'));
    }
}
