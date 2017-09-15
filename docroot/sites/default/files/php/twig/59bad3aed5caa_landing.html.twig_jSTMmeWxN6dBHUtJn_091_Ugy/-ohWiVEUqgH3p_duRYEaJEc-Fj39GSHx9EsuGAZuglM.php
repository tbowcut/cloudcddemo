<?php

/* profiles/df/themes/private/obio/layouts/landing/landing.html.twig */
class __TwigTemplate_452df3758cf8e57cbd8b5e0c3864228c6afeefee413f60f4ebd67d0a45a6eb72 extends Twig_Template
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
        $tags = array("if" => 13);
        $filters = array();
        $functions = array();

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('if'),
                array(),
                array()
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

        // line 13
        echo "<div class=\"landing-page-layout clearfix\" ";
        if ((isset($context["css_id"]) ? $context["css_id"] : null)) {
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, (isset($context["css_id"]) ? $context["css_id"] : null), "html", null, true));
        }
        echo ">
  <div class=\"row\">
    <div class=\"small-12 columns\">
      ";
        // line 16
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["content"]) ? $context["content"] : null), "top", array()), "html", null, true));
        echo "
    </div>
  </div>
    <div class=\"row\">
    <div class=\"small-12 columns\">
      ";
        // line 21
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["content"]) ? $context["content"] : null), "middle", array()), "html", null, true));
        echo "
    </div>
  </div>

   <div class=\"row full-block-spacing\">
    <div class=\"small-12 medium-3 columns\">
      ";
        // line 27
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["content"]) ? $context["content"] : null), "aside_left", array()), "html", null, true));
        echo "
    </div>
    <div class=\"columns\">
      ";
        // line 30
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["content"]) ? $context["content"] : null), "callout_right", array()), "html", null, true));
        echo "
    </div>
  </div>
  <div class=\"row full-block-spacing\">
    <div class=\"columns\">
      ";
        // line 35
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["content"]) ? $context["content"] : null), "callout_left", array()), "html", null, true));
        echo "
    </div>
    <div class=\"small-12 medium-3 columns\">
      ";
        // line 38
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["content"]) ? $context["content"] : null), "aside_right", array()), "html", null, true));
        echo "
    </div>
  </div>
  <div class=\"row\">
    <div class=\"small-12 columns\">
      ";
        // line 43
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute((isset($context["content"]) ? $context["content"] : null), "footer", array()), "html", null, true));
        echo "
    </div>
  </div>
</div>
";
    }

    public function getTemplateName()
    {
        return "profiles/df/themes/private/obio/layouts/landing/landing.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  97 => 43,  89 => 38,  83 => 35,  75 => 30,  69 => 27,  60 => 21,  52 => 16,  43 => 13,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "profiles/df/themes/private/obio/layouts/landing/landing.html.twig", "/Users/tom.bowcut/Sites/devdesktop/tb201708clouddemo-prod/docroot/profiles/df/themes/private/obio/layouts/landing/landing.html.twig");
    }
}
