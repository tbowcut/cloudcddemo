<?php

/* profiles/df/themes/private/obio/templates/menu/menu--main.html.twig */
class __TwigTemplate_d5eb4b9ed5c0a7165d531e3f755072bde6d647b6fc555741733361bdf80beeac extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $tags = array("import" => 16, "if" => 23, "macro" => 59, "for" => 76, "set" => 79);
        $filters = array();
        $functions = array("link" => 88);

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('import', 'if', 'macro', 'for', 'set'),
                array(),
                array('link')
            );
        } catch (Twig_Sandbox_SecurityError $e) {
            $e->setSourceContext($this->getSourceContext());

            if ($e instanceof Twig_Sandbox_SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

        // line 16
        $context["menus"] = $this;
        // line 17
        echo "
";
        // line 22
        echo "
";
        // line 23
        if ((isset($context["top_bar"]) ? $context["top_bar"] : null)) {
            // line 24
            echo "  <div class=\"top-bar-wrapper\">
    ";
            // line 25
            if ((isset($context["top_bar_sticky"]) ? $context["top_bar_sticky"] : null)) {
                // line 26
                echo "      <div id=\"top-bar-sticky-container\" class=\"full-width-row\" data-sticky-container>
    ";
            }
            // line 28
            echo "    <div";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, (isset($context["top_bar_attributes"]) ? $context["top_bar_attributes"] : null), "html", null, true));
            echo ">
      <div class=\"title-bar\" data-responsive-toggle=\"main-menu\" data-hide-for=\"medium\">
        <button class=\"menu-icon columns align-right small-1\" type=\"button\" data-toggle></button>
        <div class=\"small-logo align-center small-4\">
          ";
            // line 32
            if ((isset($context["site_name"]) ? $context["site_name"] : null)) {
                // line 33
                echo "            <span class=\"small-text-logo\">
            ";
                // line 34
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, (isset($context["site_name"]) ? $context["site_name"] : null), "html", null, true));
                echo "
          </span>
          ";
            }
            // line 37
            echo "        </div>
      </div>
      <nav class=\"header-bar\" id=\"main-menu\" role=\"navigation\">
        <div class=\"top-bar-left\">
          ";
            // line 41
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($context["menus"]->getmenu_links((isset($context["items"]) ? $context["items"] : null), (isset($context["attributes"]) ? $context["attributes"] : null), 0, 1)));
            echo "
        </div>
        <div class=\"top-bar-right\">
          ";
            // line 44
            if (((isset($context["secondary_menu"]) ? $context["secondary_menu"] : null) && $this->getAttribute((isset($context["secondary_menu"]) ? $context["secondary_menu"] : null), "below", array()))) {
                // line 45
                echo "            ";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($context["menus"]->getmenu_links($this->getAttribute((isset($context["secondary_menu"]) ? $context["secondary_menu"] : null), "below", array()), (isset($context["attributes"]) ? $context["attributes"] : null), 0, 1)));
                echo "
          ";
            }
            // line 47
            echo "        </div>
      </nav>
    </div>

    ";
            // line 51
            if ((isset($context["top_bar_sticky"]) ? $context["top_bar_sticky"] : null)) {
                // line 52
                echo "      </div>
    ";
            }
            // line 54
            echo "  </div>
";
        } else {
            // line 56
            echo "  ";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($context["menus"]->getmenu_links((isset($context["items"]) ? $context["items"] : null), (isset($context["attributes"]) ? $context["attributes"] : null), 0, 0)));
            echo "
";
        }
        // line 58
        echo "
";
    }

    // line 59
    public function getmenu_links($__items__ = null, $__attributes__ = null, $__menu_level__ = null, $__top_bar__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals(array(
            "items" => $__items__,
            "attributes" => $__attributes__,
            "menu_level" => $__menu_level__,
            "top_bar" => $__top_bar__,
            "varargs" => $__varargs__,
        ));

        $blocks = array();

        ob_start();
        try {
            // line 60
            echo "  ";
            $context["menus"] = $this;
            // line 61
            echo "  ";
            if ((isset($context["items"]) ? $context["items"] : null)) {
                // line 62
                echo "    ";
                if ((isset($context["top_bar"]) ? $context["top_bar"] : null)) {
                    // line 63
                    echo "      ";
                    if (((isset($context["menu_level"]) ? $context["menu_level"] : null) == 0)) {
                        // line 64
                        echo "        <ul";
                        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute($this->getAttribute((isset($context["attributes"]) ? $context["attributes"] : null), "addClass", array(0 => "menu", 1 => "dropdown", 2 => "topbar-toplevel"), "method"), "setAttribute", array(0 => "data-responsive-menu", 1 => "drilldown medium-dropdown"), "method"), "setAttribute", array(0 => "id", 1 => "findd"), "method"), "html", null, true));
                        echo ">
      ";
                    } else {
                        // line 66
                        echo "        <ul class=\"submenu menu vertical\" data-submenu>
      ";
                    }
                    // line 68
                    echo "    ";
                } else {
                    // line 69
                    echo "      ";
                    if (((isset($context["menu_level"]) ? $context["menu_level"] : null) == 0)) {
                        // line 70
                        echo "        <ul";
                        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["attributes"]) ? $context["attributes"] : null), "addClass", array(0 => "dropdown", 1 => "menu"), "method"), "html", null, true));
                        echo " data-dropdown-menu>
      ";
                    } else {
                        // line 72
                        echo "        <ul class=\"menu\">
      ";
                    }
                    // line 74
                    echo "    ";
                }
                // line 75
                echo "
    ";
                // line 76
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable((isset($context["items"]) ? $context["items"] : null));
                foreach ($context['_seq'] as $context["_key"] => $context["item"]) {
                    // line 77
                    echo "      ";
                    if ((isset($context["top_bar"]) ? $context["top_bar"] : null)) {
                        // line 78
                        echo "        ";
                        // line 79
                        $context["item_classes"] = array(0 => (($this->getAttribute(                        // line 80
$context["item"], "is_expanded", array())) ? ("menu-item--expanded") : ("")), 1 => (($this->getAttribute(                        // line 81
$context["item"], "is_collapsed", array())) ? ("menu-item--collapsed") : ("")), 2 => (($this->getAttribute(                        // line 82
$context["item"], "in_active_trail", array())) ? ("menu-item--active-trail") : ("")), 3 => (( !twig_test_empty($this->getAttribute(                        // line 83
$context["item"], "below", array()))) ? ("has-submenu") : ("")));
                        // line 86
                        echo "      ";
                    }
                    // line 87
                    echo "      <li";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute($context["item"], "attributes", array()), "addClass", array(0 => (isset($context["item_classes"]) ? $context["item_classes"] : null)), "method"), "html", null, true));
                    echo ">
        ";
                    // line 88
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->env->getExtension('Drupal\Core\Template\TwigExtension')->getLink($this->getAttribute($context["item"], "title", array()), $this->getAttribute($context["item"], "url", array())), "html", null, true));
                    echo "
        ";
                    // line 89
                    if ($this->getAttribute($context["item"], "below", array())) {
                        // line 90
                        echo "          ";
                        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($context["menus"]->getmenu_links($this->getAttribute($context["item"], "below", array()), (isset($context["attributes"]) ? $context["attributes"] : null), ((isset($context["menu_level"]) ? $context["menu_level"] : null) + 1), (isset($context["top_bar"]) ? $context["top_bar"] : null))));
                        echo "
        ";
                    }
                    // line 92
                    echo "      </li>
    ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['item'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 94
                echo "    </ul>
  ";
            }
        } catch (Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
    }

    public function getTemplateName()
    {
        return "profiles/df/themes/private/obio/templates/menu/menu--main.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  229 => 94,  222 => 92,  216 => 90,  214 => 89,  210 => 88,  205 => 87,  202 => 86,  200 => 83,  199 => 82,  198 => 81,  197 => 80,  196 => 79,  194 => 78,  191 => 77,  187 => 76,  184 => 75,  181 => 74,  177 => 72,  171 => 70,  168 => 69,  165 => 68,  161 => 66,  155 => 64,  152 => 63,  149 => 62,  146 => 61,  143 => 60,  128 => 59,  123 => 58,  117 => 56,  113 => 54,  109 => 52,  107 => 51,  101 => 47,  95 => 45,  93 => 44,  87 => 41,  81 => 37,  75 => 34,  72 => 33,  70 => 32,  62 => 28,  58 => 26,  56 => 25,  53 => 24,  51 => 23,  48 => 22,  45 => 17,  43 => 16,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "profiles/df/themes/private/obio/templates/menu/menu--main.html.twig", "/Users/tom.bowcut/Sites/devdesktop/tb201708clouddemo-prod/docroot/profiles/df/themes/private/obio/templates/menu/menu--main.html.twig");
    }
}
