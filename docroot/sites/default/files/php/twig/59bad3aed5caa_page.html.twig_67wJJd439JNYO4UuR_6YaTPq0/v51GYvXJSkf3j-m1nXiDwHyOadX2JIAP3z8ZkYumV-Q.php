<?php

/* profiles/df/themes/private/obio/templates/page.html.twig */
class __TwigTemplate_c4d199a07b04a425b4a9272443a1c2687c940ed4d49519920892d3ec6e383ab7 extends Twig_Template
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
        $tags = array("if" => 68, "spaceless" => 80);
        $filters = array("t" => 103);
        $functions = array("path" => 103);

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('if', 'spaceless'),
                array('t'),
                array('path')
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

        // line 57
        echo "<div class=\"site-wrap\">
  <div class=\"off-canvas-wrap\" data-offcanvas>
    <div class=\"inner-wrap\" id=\"inner-wrap\">
      <aside class=\"left-off-canvas-menu\" role=\"complementary\">
        ";
        // line 61
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "left_off_canvas", array()), "html", null, true));
        echo "
      </aside>

      <aside class=\"right-off-canvas-menu\" role=\"complementary\">
        ";
        // line 65
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "right_off_canvas", array()), "html", null, true));
        echo "
      </aside>

      ";
        // line 68
        if ($this->getAttribute((isset($context["page"]) ? $context["page"] : null), "meta_header", array())) {
            // line 69
            echo "        <div class=\"meta-wrapper\">
          <div class=\"row\">
            <div class=\"meta-header large-12 columns\">
              <div class=\"row align-right\">
                ";
            // line 73
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "meta_header", array()), "html", null, true));
            echo "
              </div>
            </div>
          </div>
        </div>
      ";
        }
        // line 79
        echo "
      ";
        // line 80
        if ($this->getAttribute((isset($context["page"]) ? $context["page"] : null), "highlighted", array())) {
            echo " ";
            ob_start();
            // line 81
            echo "        <div class=\"row\">
          <div class=\"large-12 highlighted-wrapper columns\">
            ";
            // line 83
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "highlighted", array()), "html", null, true));
            echo "
          </div>
        </div>
      ";
            echo trim(preg_replace('/>\s+</', '><', ob_get_clean()));
            // line 86
            echo " ";
        }
        // line 87
        echo "      <div class=\"header-wrap\">
        <div class=\"row align-center\">
          <div class=\"header-left columns\">
            ";
        // line 90
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "header", array()), "html", null, true));
        echo "
          </div>
          <div class=\"header-right columns\">
            ";
        // line 93
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "header_right", array()), "html", null, true));
        echo "
          </div>
        </div>
      </div>

      <div class=\"row\">
        ";
        // line 99
        if ((isset($context["show_account_info"]) ? $context["show_account_info"] : null)) {
            // line 100
            echo "          <div class=\"";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar((((isset($context["site_slogan"]) ? $context["site_slogan"] : null)) ? ("large-6") : ("large-4 columns large-offset-8"))));
            echo " columns hide-for-small\">
            <p>
              ";
            // line 102
            if ((isset($context["logged_in"]) ? $context["logged_in"] : null)) {
                // line 103
                echo "                <a href=\"";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("user.page")));
                echo "\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("My Account")));
                echo "</a>
                <a href=\"";
                // line 104
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("user.logout")));
                echo "\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Logout")));
                echo "</a>
              ";
            } else {
                // line 106
                echo "                <a href=\"";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("user.login")));
                echo "\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Login")));
                echo "</a>
                <a href=\"";
                // line 107
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("user.register")));
                echo "\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Sign Up")));
                echo "</a>
              ";
            }
            // line 109
            echo "            </p>
          </div>

          <div class=\"show-for-small\">
            <div class=\"six mobile-two columns\">
              <p>
                <a href=\"";
            // line 115
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("user.login")));
            echo "\" class=\"radius button\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Login")));
            echo "</a>
              </p>
            </div>
            <div class=\"six mobile-two columns\">
              <p>
                <a href=\"";
            // line 120
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("user.register")));
            echo "\" class=\"radius success button\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Sign Up")));
            echo "</a>
              </p>
            </div>
          </div>
        ";
        }
        // line 125
        echo "      </div>

      ";
        // line 127
        if (((isset($context["messages"]) ? $context["messages"] : null) &&  !(isset($context["zurb_foundation_messages_modal"]) ? $context["zurb_foundation_messages_modal"] : null))) {
            // line 128
            echo "<div class=\"l-messages row\">
        <div class=\"large-12 columns\">
          ";
            // line 130
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, (isset($context["messages"]) ? $context["messages"] : null), "html", null, true));
            echo "
        </div>
      </div>";
        }
        // line 134
        echo "
      ";
        // line 135
        if ($this->getAttribute((isset($context["page"]) ? $context["page"] : null), "help", array())) {
            // line 136
            echo "<div class=\"l-help row\">
        <div class=\"large-12 columns\">
          ";
            // line 138
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "help", array()), "html", null, true));
            echo "
        </div>
      </div>";
        }
        // line 142
        echo "
      <div class=\"row align-center\">
        <div class=\"shrink columns\">
          <section>
            ";
        // line 146
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "featured", array()), "html", null, true));
        echo "
          </section>
        </div>
      </div>

      <div class=\"row main-wrap align-center\">
        <main id=\"main\" class=\"";
        // line 152
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, (isset($context["main_grid"]) ? $context["main_grid"] : null), "html", null, true));
        echo " columns\" role=\"main\">
          <a id=\"main-content\"></a>
          ";
        // line 154
        if ((isset($context["breadcrumb"]) ? $context["breadcrumb"] : null)) {
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, (isset($context["breadcrumb"]) ? $context["breadcrumb"] : null), "html", null, true));
        }
        // line 155
        echo "          <section>
            ";
        // line 156
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "content", array()), "html", null, true));
        echo "
          </section>
        </main>

        ";
        // line 160
        if ($this->getAttribute((isset($context["page"]) ? $context["page"] : null), "sidebar_first", array())) {
            // line 161
            echo "          <div id=\"sidebar-first\" class=\"";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, (isset($context["sidebar_first_grid"]) ? $context["sidebar_first_grid"] : null), "html", null, true));
            echo " columns sidebar \">
            ";
            // line 162
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "sidebar_first", array()), "html", null, true));
            echo "
          </div>
        ";
        }
        // line 165
        echo "
        ";
        // line 166
        if ($this->getAttribute((isset($context["page"]) ? $context["page"] : null), "sidebar_second", array())) {
            // line 167
            echo "          <div id=\"sidebar-second\" class=\"";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, (isset($context["sidebar_sec_grid"]) ? $context["sidebar_sec_grid"] : null), "html", null, true));
            echo " columns sidebar\">
            ";
            // line 168
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "sidebar_second", array()), "html", null, true));
            echo "
          </div>
        ";
        }
        // line 171
        echo "      </div>

      ";
        // line 173
        if ((isset($context["reversed_logo"]) ? $context["reversed_logo"] : null)) {
            // line 174
            echo "        <div class=\"bottom-bar dark-bg\">
          <div class=\"row\">
            <div class=\"large-12 columns\">
              <p class=\"text-center footer-logo\">";
            // line 177
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, (isset($context["reversed_logo"]) ? $context["reversed_logo"] : null), "html", null, true));
            echo "</p>
              <p class=\"text-center footer-slogan\">";
            // line 178
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, (isset($context["site_slogan"]) ? $context["site_slogan"] : null), "html", null, true));
            echo "</p>
            </div>
          </div>
        </div>
      ";
        }
        // line 183
        echo "
      ";
        // line 184
        if (((($this->getAttribute((isset($context["page"]) ? $context["page"] : null), "footer_first", array()) || $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "footer_middle", array())) || $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "footer_last", array())) || $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "meta_footer", array()))) {
            // line 185
            echo "<footer id=\"footer\" class=\"dark-bg full-width-row\">
        <div class=\"full-width-inner align-center\">
          <div class=\"row\" id=\"bottom-area\">
            ";
            // line 188
            if ($this->getAttribute((isset($context["page"]) ? $context["page"] : null), "footer_first", array())) {
                // line 189
                echo "<div id=\"footer-first\" class=\"columns small-12 medium-3\">
                ";
                // line 190
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "footer_first", array()), "html", null, true));
                echo "
              </div>";
            }
            // line 193
            echo "
            ";
            // line 194
            if ($this->getAttribute((isset($context["page"]) ? $context["page"] : null), "footer_middle", array())) {
                // line 195
                echo "<div id=\"footer-middle\" class=\"columns small-12 medium-6\">
                ";
                // line 196
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "footer_middle", array()), "html", null, true));
                echo "
              </div>";
            }
            // line 199
            echo "
            ";
            // line 200
            if ($this->getAttribute((isset($context["page"]) ? $context["page"] : null), "footer_last", array())) {
                // line 201
                echo "<div id=\"footer-last\" class=\"columns small-12 medium-3\">
                ";
                // line 202
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "footer_last", array()), "html", null, true));
                echo "
              </div>";
            }
            // line 205
            echo "          </div>

          ";
            // line 207
            if ($this->getAttribute((isset($context["page"]) ? $context["page"] : null), "meta_footer", array())) {
                // line 208
                echo "<div class=\"row\">
            <div id=\"meta-footer\" class=\"columns large-12\">
              ";
                // line 210
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["page"]) ? $context["page"] : null), "meta_footer", array()), "html", null, true));
                echo "
            </div>
          </div>";
            }
            // line 214
            echo "        </div>
      </footer>";
        }
        // line 217
        echo "
      <a class=\"exit-off-canvas\"></a>
    </div>
  </div>
</div>
";
    }

    public function getTemplateName()
    {
        return "profiles/df/themes/private/obio/templates/page.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  369 => 217,  365 => 214,  359 => 210,  355 => 208,  353 => 207,  349 => 205,  344 => 202,  341 => 201,  339 => 200,  336 => 199,  331 => 196,  328 => 195,  326 => 194,  323 => 193,  318 => 190,  315 => 189,  313 => 188,  308 => 185,  306 => 184,  303 => 183,  295 => 178,  291 => 177,  286 => 174,  284 => 173,  280 => 171,  274 => 168,  269 => 167,  267 => 166,  264 => 165,  258 => 162,  253 => 161,  251 => 160,  244 => 156,  241 => 155,  237 => 154,  232 => 152,  223 => 146,  217 => 142,  211 => 138,  207 => 136,  205 => 135,  202 => 134,  196 => 130,  192 => 128,  190 => 127,  186 => 125,  176 => 120,  166 => 115,  158 => 109,  151 => 107,  144 => 106,  137 => 104,  130 => 103,  128 => 102,  122 => 100,  120 => 99,  111 => 93,  105 => 90,  100 => 87,  97 => 86,  90 => 83,  86 => 81,  82 => 80,  79 => 79,  70 => 73,  64 => 69,  62 => 68,  56 => 65,  49 => 61,  43 => 57,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "profiles/df/themes/private/obio/templates/page.html.twig", "/Users/tom.bowcut/Sites/devdesktop/tb201708clouddemo-prod/docroot/profiles/df/themes/private/obio/templates/page.html.twig");
    }
}
